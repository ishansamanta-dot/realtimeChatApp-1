import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../model/user.js"
import FriendRequest from "../model/friendRequest.js"


export const getCurrentUser=async(req,res)=>{
    try{
        let userId=req.userId
        let user=await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        return res.status(200).json(user)
    }catch (err){
        return res.status(500).json({message:`Current user error ${err}`})
        console.log("Getcurrenterror")
    }
}

export const editProfile=async(req,res)=>{
    try{
        let {bio,hobbies}=req.body
        let profilepic=req.body.profilepic;

        if(bio.length>70){
            return res.status(400).json({message:"Bio cannot exceed 70 characters."});
        }

        if (hobbies.length < 3) {
            return res.status(400).json({message: "Select at least 3 hobbies."})
        }

        if(req.file){
            profilepic=await uploadOnCloudinary(req.file.path)
        }
        let user=await User.findByIdAndUpdate(req.userId,{
            profilepic,
            bio,
            hobbies
        },
    {
    returnDocument: "after"
    })
    return res.status(200).json(user);

    }catch(err){
        return res.status(500).json({message:` Edit Profile error ${err.message}`});
    }
}

//let currentUser=await User.findById(req.userId);
export const getSuggestedUsers = async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId)
            .select("hobbies friends")
        const excludedUsers = [
            req.userId,
            ...currentUser.friends
        ]

        let users = await User.find({
            _id: { $nin: excludedUsers },
            hobbies: { $in: currentUser.hobbies }
        }).select("-password")

        // No hobby match → show other users
        if (users.length === 0) {

            users = await User.find({
                _id: { $nin: excludedUsers }
            })
            .select("-password")
            .limit(20)

        }
        return res.status(200).json(users)

    } catch (err) {
        return res.status(500).json({
            message: `Get suggested users error ${err.message}`
        })
    }
}

export const search=async (req,res)=>{
    try{
        let {query}=req.query
        if(!query){
            return res.status(400).json({message:"query is required"})
        }
        let currentUser=await User.findById(req.userId).select("friends")

        let users=await User.find({
            _id: { $in: currentUser.friends },
            fullname:{$regex:query,$options:"i"} 
        }).select("-password")
        return res.status(200).json(users)
    }catch(err){
        return res.status(500).json({message:`Search users error ${err}`})
    }
}


export const sendFriendRequest = async (req, res) => {

    try {

        const sender = req.userId
        const { receiver } = req.params

        if (String(sender) === String(receiver)) {
            return res.status(400).json({
                message: "You cannot send a request to yourself"
            })
        }

        const existingRequest = await FriendRequest.findOne({
            sender,
            receiver,
            status: "pending"
        })

        if (existingRequest) {
            return res.status(400).json({
                message: "Friend request already sent"
            })
        }

        const reverseRequest = await FriendRequest.findOne({
            sender: receiver,
            receiver: sender,
            status: "pending"
        })

        if (reverseRequest) {
            return res.status(400).json({
                message: "This user has already sent you a request"
            })
        }

        const request = await FriendRequest.create({
            sender,
            receiver
        })

        return res.status(201).json(request)

    } catch (err) {

        return res.status(500).json({
            message: `Send friend request error ${err.message}`
        })

    }
}


export const getFriendRequests = async (req, res) => {

    try {

        const requests = await FriendRequest.find({
            receiver: req.userId,
            status: "pending"
        }).populate(
            "sender",
            "-password"
        )

        return res.status(200).json(requests)

    } catch (err) {

        return res.status(500).json({
            message: `Get friend requests error ${err.message}`
        })

    }
}



export const getSentFriendRequests = async (req, res) => {
    try {
        const requests = await FriendRequest.find({
            sender: req.userId,
            status: "pending"
        }).select("receiver");

        return res.status(200).json(requests);

    } catch (err) {
        return res.status(500).json({
            message: `Get sent friend requests error ${err.message}`
        });
    }
}



export const acceptFriendRequest = async (req, res) => {

    try {

        const userId = req.userId
        const { requestId } = req.params

        const request = await FriendRequest.findOne({
            _id: requestId,
            receiver: userId,
            status: "pending"
        })

        if (!request) {
            return res.status(404).json({
                message: "Friend request not found"
            })
        }

        request.status = "accepted"
        await request.save()

        await User.findByIdAndUpdate(
            request.sender,
            {
                $addToSet: {
                    friends: request.receiver
                }
            }
        )

        await User.findByIdAndUpdate(
            request.receiver,
            {
                $addToSet: {
                    friends: request.sender
                }
            }
        )

        return res.status(200).json({
            message: "Friend request accepted"
        })

    } catch (err) {

        return res.status(500).json({
            message: `Accept friend request error ${err.message}`
        })

    }
}

export const rejectFriendRequest = async (req, res) => {

    try {

        const userId = req.userId
        const { requestId } = req.params

        const request = await FriendRequest.findOne({
            _id: requestId,
            receiver: userId,
            status: "pending"
        })

        if (!request) {
            return res.status(404).json({
                message: "Friend request not found"
            })
        }

        request.status = "rejected"
        await request.save()

        return res.status(200).json({
            message: "Friend request rejected"
        })

    } catch (err) {

        return res.status(500).json({
            message: `Reject friend request error ${err.message}`
        })

    }
}



export const getFriends = async (req, res) => {

    try {

        const user = await User.findById(req.userId)
            .select("friends")
            .populate(
                "friends",
                "-password"
            )

        return res.status(200).json(user.friends)

    } catch (err) {

        return res.status(500).json({
            message: `Get friends error ${err.message}`
        })

    }
}


export const deleteFriend = async (req, res) => {
    try {
        const userId = req.userId;
        const { friendId } = req.params;

        // Remove friend from current user's friends
        await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    friends: friendId
                }
            }
        );

        // Remove current user from friend's friends
        await User.findByIdAndUpdate(
            friendId,
            {
                $pull: {
                    friends: userId
                }
            }
        );

        return res.status(200).json({
            message: "Friend removed successfully"
        });

    } catch (err) {
        return res.status(500).json({
            message: `Delete friend error ${err.message}`
        });
    }
};