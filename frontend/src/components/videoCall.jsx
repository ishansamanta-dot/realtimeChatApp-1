import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverurl } from "../main";

function VideoCall() {

    const { userData, selectedUser } = useSelector(state => state.user);
    const callContainer = useRef(null);

    useEffect(() => {

        if (!userData || !selectedUser || !callContainer.current) {
            return;
        }

        let zp = null;

        const startCall = async () => {
            try {

                const roomID = [
                    String(userData._id),
                    String(selectedUser._id)
                ]
                    .sort()
                    .join("_");

                const result = await axios.get(
                    `${serverurl}/api/user/zego-token/${roomID}`,
                    {
                        withCredentials: true
                    }
                );

                const token = result.data.token;

                if (!token) {
                    throw new Error("ZEGO Token not received");
                }

                const kitToken =
                    ZegoUIKitPrebuilt.generateKitTokenForProduction(
                        result.data.appID,
                        token,
                        roomID,
                        String(userData._id),
                        userData.fullname
                    );

                zp = ZegoUIKitPrebuilt.create(kitToken);

                await zp.joinRoom({
                    container: callContainer.current,

                    scenario: {
                        mode: ZegoUIKitPrebuilt.OneONoneCall
                    },

                    showScreenSharingButton: true,
                    showPreJoinView: true,
                    showLeavingView: false,

                    onLeaveRoom: () => {
                        window.history.back();
                    }
                });

            } catch (err) {
                console.error("ZEGO call error:", err);
            }
        };

        startCall();

        return () => {
            if (zp) {
                zp.destroy();
            }
        };

    }, [userData, selectedUser]);

    return (
        <div
            ref={callContainer}
            className="w-full h-screen bg-[#070b1a]"
        />
    );
}

export default VideoCall;