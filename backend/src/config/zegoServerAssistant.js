import crypto from "crypto";

const makeNonce = () => {
    return Math.floor(
        -2147483648 + Math.random() * 4294967295
    );
};

export const generateToken04 = (
    appID,
    userID,
    secret,
    effectiveTimeInSeconds,
    payload = ""
) => {

    const createTime = Math.floor(Date.now() / 1000);
    const expireTime = createTime + effectiveTimeInSeconds;

    const tokenInfo = {
        app_id: appID,
        user_id: userID,
        nonce: makeNonce(),
        ctime: createTime,
        expire: expireTime,
        payload
    };

    const plainText = JSON.stringify(tokenInfo);

    const key = Buffer.from(secret, "utf8");

    if (![16, 24, 32].includes(key.length)) {
        throw new Error(
            "ZEGO_SERVER_SECRET must be 16, 24, or 32 bytes"
        );
    }

    const algorithm = `aes-${key.length * 8}-cbc`;

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        algorithm,
        key,
        iv
    );

    const encrypted = Buffer.concat([
        cipher.update(plainText, "utf8"),
        cipher.final()
    ]);

    const expireBuffer = Buffer.alloc(8);

    expireBuffer.writeBigInt64BE(
        BigInt(expireTime)
    );

    const ivLengthBuffer = Buffer.alloc(2);

    ivLengthBuffer.writeUInt16BE(
        iv.length
    );

    const encryptedLengthBuffer = Buffer.alloc(2);

    encryptedLengthBuffer.writeUInt16BE(
        encrypted.length
    );

    const result = Buffer.concat([
        expireBuffer,
        ivLengthBuffer,
        iv,
        encryptedLengthBuffer,
        encrypted
    ]);

    return "04" + result.toString("base64");
};