<script setup lang="ts">
import { cn } from '@/lib/utils'
import { MagnifyingGlassIcon } from '@radix-icons/vue'
import { ComboboxInput, type ComboboxInputProps, useForwardProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<ComboboxInputProps & {
  modelValue?: string, // Für v-model
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits(['update:modelValue']) // Für v-model-Events

const delegatedProps = computed(() => {
  const { class: _, modelValue: __, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <div class="flex items-center border-b px-3" cmdk-input-wrapper>
    <MagnifyingGlassIcon class="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <ComboboxInput v-bind="{ ...forwardedProps, ...$attrs }" auto-focus :value="props.modelValue" @input="emit('update:modelValue', $event.target.value)" :class="cn('flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50', props.class)" />
  </div>
</template>
