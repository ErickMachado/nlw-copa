import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

interface AuthProviderProps {
  children: ReactNode;
}

interface UserProps {
  avatarUrl: string;
  name: string;
}

export interface AuthContextDataProps {
  isUserLoading: boolean;
  signIn: () => Promise<void>;
  user: UserProps;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [user, setUser] = useState<UserProps>({} as UserProps);

  // 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
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "233885199041-b602512k37331a3qm4794pcopdsak8mu.apps.googleusercontent.com",
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ["profile", "email"],
  });

  async function signIn() {
    try {
      setIsUserLoading(true);

      await promptAsync();
    } catch (error) {
      console.log(error);

      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }

  async function signInWithGoogle(accessToken: string) {
    console.log(accessToken);
  }

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  return (
    <AuthContext.Provider
      value={{
        isUserLoading,
        signIn,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
