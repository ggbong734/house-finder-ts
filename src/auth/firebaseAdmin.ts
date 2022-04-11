import * as admin from "firebase-admin";
import { NextApiRequest } from "next";

const verifyIdToken = (token: string) => {
    const firebasePrivateKey: string = process.env.FIREBASE_PRIVATE_KEY ?? ""; //nullish coalescing, returns empty string if null

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: firebasePrivateKey.replace(/\\n/g, "\n"),
            })
        });
    }
    return admin
    .auth()
    .verifyIdToken(token)
    .catch(() => null);
}

export const loadIdToken = async (
    req: NextApiRequest
    ):
Promise<string | null> => {
    if(!req.cookies.token) return null; // user is not logged in if no cookie
    // if there is cookie then we need to verify it's a real token
    const decoded = await verifyIdToken(req.cookies.token);
    if (!decoded) return null; //user not authenticated
    return decoded.uid; // user is authenticated, return userid
}
