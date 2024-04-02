// This file is for type-checking of global components 
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    OInput: typeof import('@/components/shared')['OInput']
    OSelect: typeof import('@/components/shared')['OSelect']
    BasicLayout: typeof import('@/components/shared')['BasicLayout']
    InputBox: typeof import('@/components/shared')['InputBox']
    ColorPicker: typeof import('@/components/shared')['ColorPicker']
    MultiNumSelect: typeof import('@/components/shared')['MultiNumSelect']
    DatePicker: typeof import('@/components/shared')['DatePicker']
    Calendar: typeof import('@/components/shared')['Calendar']
    CalendarNav: typeof import('@/components/shared')['CalendarNav']
    OTime: typeof import('@/components/shared')['OTime']
    ResourceCalendar: typeof import('@/components/shared')['ResourceCalendar']
    OTable: typeof import('@/components/shared')['OTable']
    OCheckbox: typeof import('@/components/shared')['OCheckbox']
    OFile: typeof import('@/components/shared')['OFile']
  }
}

export {}