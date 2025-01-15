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

    async fetchJourney(journeyId: any) {
      const subJourneyId = journeyId || 0;
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

    async addVaccine(vaccinationData: any) {
      const requestBody = {
        user_id: this.user.account_id,
        vaccine: vaccinationData,
      };

      try {
        const response = await fetch('https://n8n.tonii.at/webhook/addVaccie', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error('Failed to add vaccination');
        }

        return response.json();

      } catch (error) {
        console.error('Error adding vaccination:', error);
      }
    },



    async addNodeToJourney(newNode: any) {
      console.log('Adding node:', newNode);
      const url = "https://n8n.tonii.at/webhook/addNode";
      const user_id = this.user.account_id;
      const journey_id = 1;
      const nodeData = newNode;

      const requestBody = {
        user_id,
        journey_id,
        ...nodeData,
      };

      console.log("Node Data:", nodeData);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Json response (should be old and updated user):', data[0]);
        } else {
          console.error('Failed to add node:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding node:', error);
      }
    },

    async globalSearch(query: string) {
      try {
        const response = await fetch(`https://n8n.tonii.at/webhook/globalSearch?id=${this.user.account_id}&name=${query}`);

        if (!response.ok) {
          throw new Error('Error fetching search results');
        }

        const data = await response.json();
        return data;

      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    },

    async fetchHistory() {
      try {
        const response = await fetch(`https://n8n.tonii.at/webhook/history?id=${this.user.account_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Error fetching history.');
        }

        const data = await response.json();
        return data
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data. Check console for details.');
      }
    },

    async fetchOverview() {
      try {
        const response = await fetch(`https://n8n.tonii.at/webhook/getDataForOverview?id=${this.user.account_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        return data;

      } catch (error) {
        console.error('Error fetching overview:', error);
        alert('Failed to fetch overview. Check console for details.');
      }
    },

    async toggleStatus(journeyId, newStatus) {
      try {
        const response = await fetch('http://n8n.tonii.at/webhook/status', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: this.user.account_id,
            journey_id: journeyId,
            status: newStatus
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update status');
        }
        return true;

      } catch (error) {
        console.error('Error updating status:', error);
        return false;
      }
    },

    async fetchNodeDetails() {
      const id = '677ba8958eca95927318b059';
      const journey_id = 1;
      const node_id = 1;

      try {
        const baseUrl = 'https://n8n.tonii.at/webhook/node';
        const response = await fetch(`${baseUrl}?id=${id}&journey_id=${journey_id}&node_id=${node_id}`);
        if (!response.ok) {
          throw new Error(`HTTP error fetching n8n: ${response.status}`);
        }

        const data = await response.json();
        const filteredData = Object.fromEntries(
          Object.entries(data[0]).filter(([key]) => key !== '_id')
        );

        // Check for mapped types first
        const nodeTypeKey = data[0].type;
        selectedType.value = typeMappings[nodeTypeKey] ||
          Object.keys(fieldTemplates).find((type) =>
            fieldTemplates[type].every((template) =>
              Object.keys(filteredData).includes(
                template.label.toLowerCase().replace(/ /g, '_')
              )
            )
          ) || 'Other';

        responseData.value = [filteredData];
        originalFields.value = Object.entries(filteredData).map(([key, value]) => ({
          label: key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
          value,
        }));
        editedFields.value = JSON.parse(JSON.stringify(originalFields.value));
      } catch (error) {
        console.error('Error fetching node:', error);
      }
    }


  },
});
