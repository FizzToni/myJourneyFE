<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAccountStore } from '@/stores/account';

const { user } = storeToRefs(useAccountStore());
</script>

<template>
  <div>
    <h1>Main</h1>
    <div>
      <h2>User Information:</h2>
      <p><strong>Username:</strong> {{ user.username }}</p>
      <p><strong>Account ID:</strong> {{ user.account_id }}</p>
      <p><strong>Auth Token:</strong> {{ user.auth_token }}</p>
    </div>
  </div>
</template>
