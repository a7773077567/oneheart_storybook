// This type file is for type-checking of global components 
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    OSelect: typeof import('@/components/shared')['OSelect']
    OInput: typeof import('@/components/shared')['OInput']
    InputBox: typeof import('@/components/shared')['InputBox']
    BasicLayout: typeof import('@/components/shared')['BasicLayout']
    DurationSelect: typeof import('@/components/shared')['DurationSelect']
    ColorPicker: typeof import('@/components/shared')['DurationSelect']
  }
}

export {}