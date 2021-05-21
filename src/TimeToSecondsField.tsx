import * as React from 'react'
import {withDocument} from 'part:@sanity/form-builder'
import {TextInput, studioTheme, ThemeProvider} from '@sanity/ui'
import {isValidationErrorMarker} from '@sanity/types'
import FormField from 'part:@sanity/components/formfields/default'
import PatchEvent, {set, unset} from 'part:@sanity/form-builder/patch-event'

export {validateTimeFormat} from './utils'

import {validateTimeFormat, convertSecondsToString, convertStringMMSSToSeconds} from './utils'

import {Marker, Path} from '@sanity/types'

export type Props = {
  type: {
    _type?: string
    title: string
    description?: string
    name: string
    options?: {
      placeholder?: string
      [s: string]: any
    }
  }
  level: number
  options: {[s: string]: any}
  value: number | undefined
  readOnly: boolean | null
  onChange: (ev: any) => void
  // Note: we should allow implementors of custom inputs to forward the passed onFocus to native element's onFocus handler,
  // but use Path consistently on internal inputs
  onFocus: (path?: Path | React.FocusEvent<any>) => void
  onBlur?: () => void
  markers: Marker[]
  presence: any[]
}

const validTime = (str: string) => {
  return validateTimeFormat(str) === true
}
const TimeToSecondsField = React.forwardRef(
  (props: Props, forwardedRef: React.ForwardedRef<HTMLInputElement>) => {
    const {type, level, onFocus, onBlur, value, markers, presence} = props
    const [stagedValue, setStagedValue] = React.useState(
      convertSecondsToString(Number(value), true)
    )

    const options: {placeholder?: string} = type.options || {}
    const errors = React.useMemo(() => markers.filter(isValidationErrorMarker), [markers])
    const handleChange = React.useCallback(
      (val) => {
        setStagedValue(val)
        if (validTime(val)) {
          const secondsValue = convertStringMMSSToSeconds(val)
          props.onChange(PatchEvent.from(secondsValue ? set(secondsValue) : unset()))
        }
      },
      [props.onChange, type.name, setStagedValue]
    )
    const onChange = React.useCallback((e) => handleChange(e.target.value), [handleChange])
    const validationError =
      errors.length > 0
        ? errors[0].item.message
        : validTime(stagedValue)
        ? false
        : validateTimeFormat(stagedValue)

    return (
      <ThemeProvider theme={studioTheme}>
        <FormField
          label={type.title}
          __unstable_markers={markers}
          __unstable_presence={presence}
          level={level}
          description={type.description}
        >
          <TextInput
            onBlur={onBlur}
            type={'text'}
            placeholder={options.placeholder || 'Enter a time in 00:00 format'}
            onFocus={onFocus}
            customValidity={validationError}
            ref={forwardedRef}
            maxLength={5}
            onChange={onChange}
            value={stagedValue}
          />
        </FormField>
      </ThemeProvider>
    )
  }
)

export default withDocument(TimeToSecondsField)
