const verificationOtp = async (request, response, next) => {
    request.otpType = "verification";
    next();
}

const passwordResetOtp = async (request, response, next) => {
    request.otpType = "password-reset";
    next();
}

export {verificationOtp, passwordResetOtp}