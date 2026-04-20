import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { googleIcon } from "../utils"
import { Button } from "./common/ui/button"
import { signUpWithGoogle } from "../utils/auth/signUpWithGoogle";

export default function GoogleBtn() {
    const { state, dispatch } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname + (location.state?.from?.search || "") || "/dashboard";

    if (state.loading) return <p>Loading...</p>
    
    const onSubmit = async () => {
        const user = await signUpWithGoogle();
        if (user) {
          dispatch({ type: 'LOGIN', payload: user });
          navigate(from, { replace: true });
    
        } else {
          console.log("Failed");
        }
      };
    return (<>
        <Button onClick={onSubmit} size={"lg"} className="bg-white text-black rounded-lg
        w-full sm:w-96  pr-16 pt-6 h-14 pb-6 font-medium text-base
        flex gap-5 border border-black hover:text-secondary hover:bg-ring transition-all duration-75">
            <span><img src={googleIcon} alt="google Icon" width={17}/></span>
            <span>Continue with Google</span> 
        </Button>
    </>
    )
}
