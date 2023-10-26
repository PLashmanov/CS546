/**
 * TODO create user from registration page
 * 
 */

class RegistrationService{



    static async #hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt(5);
            const hashedPassword = await bcrypt.hash(password, salt);
            return hashedPassword;
        } catch (error) {
            console.error("Error hashing password:", error);
            throw error;
        }
    }

}