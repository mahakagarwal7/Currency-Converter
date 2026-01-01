require('dotenv').config();

const axios = require('axios');



const getExchangeRate = async (fromCurrency,toCurrency) => {

    const response =  await axios.get(process.env.EXCHANGE_API_URL);
    const rate = response.data.rates;
    const euro = 1/rate[fromCurrency];
    const exchangeRate = euro * rate[toCurrency];

    if(isNaN(exchangeRate)){
        throw new Error (`Unable to get currency ${fromCurrency} and ${toCurrency} `);
    }

    return exchangeRate;
}  

const getCountries = async (toCurrency) => {

    try{
         const response = await axios.get(`https://restcountries.com/v3.1/currency/${toCurrency}`)

     
         return response.data.map(country => country.name.common);
    }catch(error){
         throw new Error(`Unable to get countries that use ${toCurrency}`);
    }
     
}

const convertCurrency = async (fromCurrency,toCurrency,amount) => {
    const countries = await getCountries(toCurrency);
    const exchangeRate = await getExchangeRate(fromCurrency,toCurrency);
   
    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries: ${countries.join(', ')}`;




}

convertCurrency('USD','EUR',30).then((message) => {
    console.log(message);
}).catch((error) => {
    console.log(error.message);
});

  


