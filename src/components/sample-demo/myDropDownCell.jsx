import * as React from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import categories from './categories';

export const DropDownCell = props => {
  const localizedData = categories
  
  const handleChange = e => {
    if (props.onChange) {
      props.onChange({
        dataIndex: 0,
        dataItem: props.dataItem,
        field: props.field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value.CategoryID
      });
    }
  };
  const {
    dataItem
  } = props;
  const field = props.field || '';
  const dataValue = dataItem[field] === null ? '' : dataItem[field];
  return <td>
            {dataItem.inEdit ? (
        <DropDownList
          style={{ width: '100px' }}
          onChange={handleChange}

          data={localizedData}
          textField="CategoryName"
          dataItemKey="CategoryID"
        />
      ) : dataValue == null ? (
        ''
      ) : (
        localizedData.find(c => c.CategoryID === dataValue)?.CategoryName || dataValue
      )}
      </td>;
};