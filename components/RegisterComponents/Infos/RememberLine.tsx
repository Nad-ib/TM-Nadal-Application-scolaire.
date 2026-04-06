import RememberButton from "./RememberButton"

export default function RememberLine() {

    return(
        <div className="w-full h-7 flex justify-between items-center">
            <div className="flex flex-row h-full items-center justify-center gap-4">
                <RememberButton/>
                <span>Remember Me</span>
            </div>
            <div><span>Forgot Password ?</span></div>
        </div>
    )
}