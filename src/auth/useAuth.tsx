import {
    useEffect,
    useState,
    useContext,
    createContext,
    FunctionComponent,
} from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/auth";
import initFirebase from "./initFirebase";
import { removeTokenCookie, setTokenCookie } from "./tokenCookies";
import Auth from "pages/auth";

// we will create our custom authProvider here

// initialize firebase
initFirebase();

// for typescript we need to define types
interface IAuthContext {
    user: firebase.User | null;
    logout: () => void;
    authenticated: boolean;
}


//we create a context next, provider allows us to share
// state from the top of app to anywhere without having to pass props

const AuthContext = createContext<IAuthContext>({
    user: null,
    logout: () => null,
    authenticated: false
});

// children here being the components that go inside auth provider
export const AuthProvider: FunctionComponent = ({ children }) => {
    const [user, setUser] = useState<firebase.User | null>(null);
    const router = useRouter();
    const logout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                router.push("/")
            })
            .catch(e => console.error(e));
    }

    useEffect(() => {
        const cancelAuthListener = firebase.auth().onIdTokenChanged(async (user) => {
            if (user) {  // user is logged in
                const token = await user.getIdToken();
                setTokenCookie(token);
                setUser(user);
            } else { // user is not logged in
                removeTokenCookie();
                setUser(null);
            }
        });

        // if we return a function in useEffect, it will be called when the component unmounts
        // we no longer want to listen to auth changes when component unmounts
        return () => {
            cancelAuthListener();
        }
    }, []);

    // custome auth provider that provides the value to every child
    return (<AuthContext.Provider value={{ user, logout, authenticated: !!user }}>
        {children}
    </AuthContext.Provider>
    );
};

// custom hook so we can access user, logout, and whether they are authenticated from anywhere in the app
export function useAuth() {
    return useContext(AuthContext);
}
