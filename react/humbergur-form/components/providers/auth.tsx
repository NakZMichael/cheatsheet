import React, {
  createContext, Dispatch, useContext, useMemo, useReducer,
} from 'react';
import { AuthApi } from '../../api/auth';
import { ApplicationUser } from '../../api/entities/user';
import { Action } from './utils/action';

interface AuthState{
  user?: ApplicationUser,
}

type AuthAction =
  | Action<'signIn', {
    user: ApplicationUser
  }>
  | Action<'signOut', {

  }>

const AuthReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'signIn': {
      return {
        ...state,
        user: action.payload.user,
      };
    }
    case 'signOut': {
      return {
        ...state,
        user: undefined,
      };
    }
    default: {
      return { ...state };
    }
  }
};

const initialState:AuthState = {
  user: undefined,
};

const AuthContext = createContext<{
  state: AuthState,
  dispatch: Dispatch<AuthAction>
}>({
  state: initialState,
  dispatch: () => {},
});

interface AuthContextProviderProps{
  children:React.ReactNode
}
export const AuthContextProvider = ({
  children,
}: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);
  const value = useMemo(() => ({
    state,
    dispatch,
  }), [state]);
  return (
    <AuthContext.Provider value={value}>
      {
      children
}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { state, dispatch } = useContext(AuthContext);
  const signIn = async (params: {
    userName: string,
    password: string,
  }) => {
    const accessedUser = await AuthApi.signIn({
      userName: params.userName,
      password: params.password,
    });
    console.log({ accessedUser });
    if (accessedUser) {
      dispatch({
        type: 'signIn',
        payload: {
          user: accessedUser,
        },
      });
    } else {
      throw new Error('ユーザーが存在しません。');
    }
  };
  const { user } = state;

  const signUp = async (user:ApplicationUser) => {
    await AuthApi.signUp(user);
  };
  const signOut = async () => {
    dispatch({
      type: 'signOut',
      payload: {},
    });
  };
  return {
    signIn,
    user,
    signUp,
    signOut,
  };
};
