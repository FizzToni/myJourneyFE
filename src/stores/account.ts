import { defineStore } from 'pinia';

export const useAccountStore = defineStore('account', {
  state: () => ({
    user: {
      email: '',
      password: '',
      account_id: null,
      name: '',
      surname: '',
      birthYear: 2000,
      gender: '',
      vaccines: [],
      bloodWork: [],
      otherTrackables: []
    },
  }),
  persist: true,
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
          ...this.user,
          email: data.email,
          password: data.password,
          account_id: data._id
        };

        console.log(`[Login]: ${this.user.account_id}`)
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
          ...this.user,
          email: data.email,
          password: data.password,
          account_id: data._id
        };

        console.log(`[Account]  Created user:`, this.user.account_id)
      } catch (error) {
        console.error('[Account] Error during account creation:', error);
        throw error;
      }
    },

    async setAccountDetails(details: any) {
      const accountDetails = {
        "_id": this.user.account_id,
        "name": details.name,
        "surname": details.surname,
        "birthYear": details.birthYear,
        "email": this.user.email,
        "password": this.user.password,
        "gender": details.gender,
        "vaccines": details.vaccines,
        "bloodWork": details.bloodWork,
        "otherTrackables": details.otherTrackables,
      };

      console.log(`[Account] Details: ${JSON.stringify(accountDetails, null, 2)}`)

      try {
        const response = await fetch('https://n8n.tonii.at/webhook/selectPrefences', {
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

        this.user = {
          ...this.user,
          name: data.name,
          surname: data.surname,
          birthYear: data.birthYear,
          gender: data.gender,
          vaccines: data.vaccines,
          bloodWork: data.bloodWork,
          otherTrackables: data.otherTrackables
        }

        return data.json();

      } catch (error) {
        console.error('[Account] Failed to update account details:', error);
        throw error;
      }
    },

    async fetchJourney(subJourneyId: any) {

      try {
        const id = this.user.account_id;
        const response = await fetch(`https://n8n.tonii.at/webhook/myjourney?id=${id}&journey_id=${subJourneyId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching journey: ${response.status}`);
        }
        const data = await response.json();
        return data;

      } catch (error) {
        console.error('Error fetching journeys:', error);
        alert('Failed to fetch journeys. Check console for details.');
      }
    },

    async fetchUserDetails() {
      try {
        const id = this.user.account_id;
        const response = await fetch(`https://n8n.tonii.at/webhook/user?id=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching user details: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;

      } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Failed to fetch user details. Check console for details.');
      }
    },

  },
});
