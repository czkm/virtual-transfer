export interface TransferData {
  id?: string
  name?: string
  disabled?: string
  subInfo?: string
}
export interface TransferFormat {
  noChecked?: string
  hasChecked?: string
}
export type CheckboxValueType = string | number | boolean

export enum TransferTypeEnum {
  LEFT = 'left',
  RIGHT = 'right'
}

export interface Props {
  leftTitle?: string
  rightTitle?: string
  keyProp?: string
  labelProp?: string
  subInfoProp?: string
  defaultCheckedLeftList?: Array<number | string>
  defaultCheckedRightList?: Array<number | string>
  left: Array<TransferData>
  right: Array<TransferData>
  filterMethod?: (
    searchValue: string,
    item: any,
    type: TransferTypeEnum
  ) => boolean
  footerFormat?: TransferFormat
}

export const transferProps = {
  leftTitle: '左标题',
  rightTitle: '右标题',
  keyProp: 'id',
  labelProp: 'name',
  subInfoProp: 'subInfo'
}

export interface transferEmitsInterface {
  (event: 'search'): boolean
}
export const TransFerEmits = ['search']
