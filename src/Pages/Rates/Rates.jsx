import { useState } from 'react';
import DropDown from '../../Components/DropDown';
import TextInput from '../../Components/InputField/TextInput';
import ProgressBar from '../../Components/ProgressBar';
import Loader from '../../Components/Loader';

import { useAnimationFrame } from '../../Hooks/useAnimationFrame';
import { ReactComponent as Transfer } from '../../Icons/Transfer.svg';

import classes from './Rates.module.css';

import CountryData from '../../Libs/Countries.json';
import countryToCurrency from '../../Libs/CountryCurrency.json';
import { useEffect } from 'react';

let countries = CountryData.CountryCodes;

const Rates = () => {
  const [fromCurrency, setFromCurrency] = useState('AU');
  const [toCurrency, setToCurrency] = useState('US');
  const [inputAmount, setInputAmount]= useState(1)
  const [resultAmount, setResultAmount]=useState({
    actualAmount:0,
    fxAmount:0
  })
  const {actualAmount, fxAmount}=resultAmount
  const [exchangeRate, setExchangeRate] = useState(0.7456);
  const [progression, setProgression] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    
    
    setResultAmount({actualAmount:parseFloat(exchangeRate*parseFloat(inputAmount)).toFixed(3), fxAmount:parseFloat(exchangeRate*parseFloat(inputAmount)-exchangeRate*parseFloat(inputAmount)*0.005).toFixed(3)})
  }, [inputAmount, exchangeRate, fromCurrency])

  useEffect(()=>{
    setLoading(true)
    const fetchNewData = async ()=>{
      const settings = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    };
      const res = await fetch(`https://rates.staging.api.paytron.com/rate/public?buyCurrency=${countryToCurrency[fromCurrency]}&sellCurrency=${countryToCurrency[toCurrency]}`, settings)
      const data = await res.json()
      if(data.retailRate)
      {
        setExchangeRate(data.retailRate)
        setLoading(false)
        setProgression(0)
      }
      else{
        setResultAmount({actualAmount:'Not Available right now', fxAmount:'Not Available right now'})
        console.log(data.detail)
      }
      
    }
    fetchNewData()
  }, [fromCurrency, toCurrency])
  const Flag = ({ code }) => <img alt={code || ''} src={`/img/flags/${code || ''}.svg`} width="20px" className={classes.flag} />;

  const fetchData = async () => {
    
    if (!loading) {
      setLoading(true);
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const settings = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    };
      const res = await fetch(`https://rates.staging.api.paytron.com/rate/public?buyCurrency=${countryToCurrency[fromCurrency]}&sellCurrency=${countryToCurrency[toCurrency]}`, settings)
      const data = await res.json()
      if(data.retailRate)
      {
        setExchangeRate(data.retailRate)
        setLoading(false)
        setProgression(0)
        
      }else{
        setResultAmount({actualAmount:'Not Available right now', fxAmount:'Not Available right now'})
      }
      
      
      
      
    }
  };
  

  // Demo progress bar moving :)
  useAnimationFrame(!loading, (deltaTime) => {
    setProgression((prevState) => {
      
      if (prevState > 0.998) {
        fetchData();
        return 0;
      }
      return (prevState + deltaTime * 0.0001) % 1;
    });
  });
  

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.heading}>Currency Conversion</div>

        <div className={classes.rowWrapper}>
          <div>
            <DropDown
              leftIcon={<Flag code={fromCurrency} />}
              label={'From'}
              selected={countryToCurrency[fromCurrency]}
              options={countries.map(({ code }) => ({ option: countryToCurrency[code], key: code, icon: <Flag code={code} /> }))}
              setSelected={(key) => {
                setFromCurrency(key);
                
              }}
              style={{ marginRight: '20px' }}
            />
          </div>

          <div className={classes.exchangeWrapper}>
            <div className={classes.transferIcon}>
              <Transfer height={'25px'} />
            </div>
            {loading ?(
          <div className={classes.loaderWrapper}>
            <Loader width={'25px'} height={'25px'} />
          </div>
        ):
            <div className={classes.rate}>{exchangeRate}</div>}
          </div>

          <div>
            <DropDown
              leftIcon={<Flag code={toCurrency} />}
              label={'To'}
              selected={countryToCurrency[toCurrency]}
              options={countries.map(({ code }) => ({ option: countryToCurrency[code], key: code, icon: <Flag code={code} /> }))}
              setSelected={(key) => {
                setToCurrency(key);
                
              }}
              style={{ marginLeft: '20px' }}
            />
          </div>
        </div>

        <ProgressBar progress={progression} animationClass={loading ? classes.slow : ''} style={{ marginTop: '20px' }} />
        <div style={{marginTop:'16px'}} className={classes.rowWrapper}>
          <div className={classes.amountHeading}>Enter the Amount you want to convert </div><br/>
          
          <div className={classes.amountHeading}>The amount you will be receiving</div>      
          

        </div>
        <div className={classes.flexInputItems}>
          
        <TextInput label='Input Amount' setChange={setInputAmount} value={inputAmount}/>
        <div className={classes.flexContentBetween}></div>
        <TextInput label='True Amount' value={actualAmount} disabled={true}/>
        <TextInput label='Markup Amount' value={fxAmount} disabled={true}/>
        </div>
        
      </div>
    </div>
  );
};

export default Rates;
