import { defineStore } from 'pinia';

export const useAccountStore = defineStore('account', {
  state: () => ({
    user: {
      email: '',
      password: '',
      account_id: null
    },
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await fetch('https://n8n.tonii.at/webhook/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();

        // Save the user data to the store
        this.user = {
          email: data.email,
          password: data.password,
          account_id: data.id
        };
      } catch (error) {
        console.error('[Account] Error during login:', error);
        throw error; // Forward the error to the component
      }
    },


    async createAccount(email: string, password: string) {
      try {
        const response = await fetch('https://n8n.tonii.at/webhook/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Account creation failed');
        }

        const data = await response.json();

        // Save the user data to the store
        this.user = {
          email: data.email,
          password: data.password,
          account_id: data.id
        };

        console.log(`[Account]  Created user:`, this.user.account_id)
      } catch (error) {
        console.error('[Account] Error during account creation:', error);
        throw error;
      }
    },


    async setAccountDetails(details) {
      const accountDetails = {
        "id": this.user.account_id,
        "name": details.name,
        "surname": details.surname,
        "email": this.user.email,
        "password": this.user.password,
        "gender": details.gender,
        "vaccines": details.vaccines,
        "bloodWork": details.bloodWork,
        "otherTrackables": details.otherTrackables,
      };

      console.log(`[Account] Details: ${JSON.stringify(accountDetails, null, 2)}`)

      try {
        const response = await fetch('https://n8n.tonii.at/webhook-test/selectPrefences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(accountDetails)
        });

        if (!response.ok) {
          throw new Error('Set Account Details failed');
        }

        const data = await response.json();

        console.log(`Data: ${data}`);

      } catch (error) {
        console.error('[Account] Failed to update account details:', error);
        throw error;
      }

    }
  },


});
