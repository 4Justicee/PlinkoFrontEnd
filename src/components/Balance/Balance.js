import React, { useMemo, useRef } from "react";
import Select from 'react-select';
import { useDispatch, useSelector } from "react-redux";
import {setCurrency} from '../../store/gameSlice'
const Balance = () => {
  const dispatch = useDispatch()
  const store = useSelector(state=>state.game)
  const balances = store?.balances
  const currency = store.currency

  const handleBalance = (e)=>{
    dispatch(setCurrency(e.currency))
  }

  const customStyles = {  
    control: (provided, state) => ({  
      ...provided,  
      backgroundColor: '#192c38',  // Dark background for the select control  
      color: 'white',  // White text color  
      borderColor: '#557086' ,  
      boxShadow: 'none',  
      '&:hover': {  
        borderColor: '#557086'
      }
    }),  
    option: (provided, state) => ({  
      ...provided,  
      backgroundColor: '#192c38',  
      color: state.isSelected ? 'white' : state.isFocused ? 'black' : 'white'  
    }),  
    menu: (provided, state) => ({  
      ...provided,  
      backgroundColor: '#192c38'  
    }),  
    singleValue: (provided, state) => ({  
      ...provided,  
      color: 'white'  
    }),
    menuList: (provided) => ({  
        ...provided,  
        // Include specific scrollbar styles for the dropdown list  
        '::-webkit-scrollbar': {  
            width: '8px',  
        },  
        '::-webkit-scrollbar-track': {  
            background: '#f1f1f1',  
        },  
        '::-webkit-scrollbar-thumb': {  
            background: 'darkgray',  
            borderRadius: '5px',  
        },  
        '::-webkit-scrollbar-thumb:hover': {  
            background: '#555',  
        },  
        // Firefox requires these  
        'scrollbarWidth': 'thin',  
        'scrollbarColor': 'darkgray #0f213e'  
    }), 
  };   

  const balanceOptions = useMemo(() => {  
    return balances.map(item => ({  
      value: item.balance,  
      label: (  
        <div style={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' }}>  
          <div style={{ display: 'flex', alignItems: 'center'}}>
            <img src={`/coin/${item.currency}.black.png`} alt={item.currency} style={{ marginRight: 8, height: 20 }} />  
            {item.currency}  
          </div>
          <div>
            {item.balance.toFixed(5)}
          </div>
        </div>  
      ),
      currency: item.currency
    }));  
  }, [balances]);  


  return (
    <div className='balance-section'>      
      <div className='balance-div'>
          <p>
            Current balance:
          </p>
          <div style={{flexGrow:1}}>
            <Select  
            value={balanceOptions.find(option => option.currency === currency)} 
            onChange={handleBalance}  
            options={balanceOptions}  
            styles={customStyles}  
            /> 
          </div>
      </div>
    </div>
  );
};

export default Balance;
