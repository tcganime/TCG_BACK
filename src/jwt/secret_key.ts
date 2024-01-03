class SecretKey {
    secret_key: string;

    constructor() {
        this.secret_key = this.generateSecretKey();
    }

    generateSecretKey() : string {
        const crypto = require('crypto');
        let secret_key = crypto.randomBytes(64).toString('hex');
        return secret_key;
    }
    
    get getSecretKey() : string {
        return this.secret_key;
    }
}

export default new SecretKey();