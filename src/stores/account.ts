import { defineStore } from 'pinia';

export const useAccountStore = defineStore('account', {
  state: () => ({
    user: {
      username: '',
      account_id: null,
      auth_token: '',
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
          username: data.username,
          account_id: data.account_id,
          auth_token: data.auth_token,
        };
      } catch (error) {
        console.error('Error during login:', error);
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
          username: data.username,
          account_id: data.account_id,
          auth_token: data.auth_token,
        };
      } catch (error) {
        console.error('Error during account creation:', error);
        throw error;
      }
    },


    async setAccountDetails() {

    }
  },
});
