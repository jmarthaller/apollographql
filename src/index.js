import React from 'react';
import { render } from 'react-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";
import { gql, useQuery } from '@apollo/client';


const client = new ApolloClient({
  uri: "https://71z1g.sse.codesandbox.io/",
  cache: new InMemoryCache()
});

const GET_DOGS = gql`
    query getDogs {
        dogs {
            id
            breed
        }
    }
`;


// const EXCHANGE_RATES = gql`
//   query GetExchangeRates {
//     rates(currency: "USD") {
//       currency
//       rate
//     }
//   }
// `;

function Dogs({ onDogSelected }) {
    const { loading, error, data } = useQuery(GET_DOGS);
    
    if (loading) return `loading... (spinny wheel)`;
    if (error) return `Sorry, there was an error`;
    
    return (
        <select name="dog" onChange={onDogSelected}>
           {data.dogs.map(dog => (
               <option key={dog.id} value={dog.breed}>
                   {dog.breed}
               </option>
           ))}
        </select>
    );
}


// function ExchangeRates() {
//     const { loading, error, data } = useQuery(EXCHANGE_RATES);
//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error :(</p>;
//     // MAP THROUGH CURRENCY DATA
//     return data.rates.map(({ currency, rate }) => (
//       <div key={currency}>
//         <p>
//           {currency}: {rate}
//         </p>
//       </div>
//     ));
//   }
  

function App() {
  return (
    <div>
      <h2>Doggos via Apollo/GraphQL <span role="img" aria-label="rocket">🚀</span></h2>
      {/* <ExchangeRates /> */}
      <Dogs />
    </div>
  );
}

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);