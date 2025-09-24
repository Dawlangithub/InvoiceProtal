import {
    getAuth,
    signInWithPopup,
    signOut,
    UserCredential,
    Auth,
    User
} from "firebase/auth";
import { app, provider } from "./config";
import { Post } from "../apimethods";

const auth: Auth = getAuth(app);


export const firebaseLogin = (): Promise<User> => {
    return new Promise((resolve, reject) => {
        signInWithPopup(auth, provider)
            .then((result: UserCredential) => {
                const user = result.user;

                if (!user.email) {
                    throw new Error("Email is required for registration");
                }

                const userData: any = {
                    email: user.email,
                    phone: user.phoneNumber,
                    googleId: user.uid,
                    picture: user.photoURL,
                    fullName: user.displayName,
                    password: null,
                    userType: "client"
                };

                return Post('users/register-user', userData)
                    .then((res: any) => {
                        resolve(res);
                    })
                    .catch((apiError) => {
                        console.error("API Registration failed:", apiError);
                        // Still resolve with user if API fails but log the error
                        resolve(user);
                    });
            })
            .catch((error: any) => {
                console.error("Firebase Login Error:", {
                    code: error.code,
                    message: error.message,
                    email: error.customData?.email
                });

                let errorMessage: string;
                switch (error.code) {
                    case 'auth/popup-closed-by-user':
                        errorMessage = "Login cancelled by user";
                        break;
                    case 'auth/popup-blocked':
                        errorMessage = "Login popup was blocked. Please allow popups and try again";
                        break;
                    case 'auth/account-exists-with-different-credential':
                        errorMessage = "An account already exists with this email using a different login method";
                        break;
                    default:
                        errorMessage = "Failed to login. Please try again";
                }

                reject(new Error(errorMessage));
            });
    });
};

export const firebaseLogout = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        signOut(auth)
            .then(() => {
                resolve(true);
            })
            .catch((error: any) => {
                console.error("Logout Error:", error);
                reject(new Error("Failed to logout. Please try again"));
            });
    });
};

export const firebaseGetUser = (): Promise<User> => {
    return new Promise((resolve, reject) => {
        const user = auth.currentUser;

        if (user) {
            resolve(user);
        } else {
            // Check if we're still initializing
            const unsubscribe = auth.onAuthStateChanged((user) => {
                unsubscribe(); // Stop listening immediately
                if (user) {
                    resolve(user);
                } else {
                    reject(new Error("No user is currently signed in"));
                }
            });
        }
    });
};