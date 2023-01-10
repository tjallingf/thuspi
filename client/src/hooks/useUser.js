import UserModel from '../app/models/UserModel';

let __user = {};

const useUser = () => __user;

const UserProvider = ({ user, children }) => {
    __user = user;
    return children;
}

export default useUser;
export { useUser, UserProvider }