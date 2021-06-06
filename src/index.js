import React, { useState } from 'react';
import { render } from 'react-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  NetworkStatus,
  useLazyQuery
} from "@apollo/client";



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

const GET_DOG_PHOTO = gql`
    query Dog($breed: String!) {
        dog(breed: $breed) {
            id
            displayImage
        }
    }
`;


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


function DogPhoto({ breed }) {
    const { loading, error, data, refetch, networkStatus } = useQuery(GET_DOG_PHOTO, {
        variables: { breed },
        // pollInterval: 1000,
        notifyOnNetworkStatusChange: true
    });

    if (networkStatus === NetworkStatus.refetch) return 'Refetching as we speak!';
    if (loading) return null;
    if (error) return `No Doggo picture here due to ${error} error`;

    return ( 
        <div>
            <img src={data.dog.displayImage} style={{ height: 200, width: 200 }} alt="dog" />
            <button onClick={() => refetch()}>Refetch New Dog Photo</button>
        </div>
    );
}


// function DelayedQuery() {
//     const [getDog, { loading, data }] = useLazyQuery(GET_DOG_PHOTO);

//     if (loading) return <p>We're Loading now</p>;

//     return (
//         <div>
//             {data && data.dog && <img src={data.dog.displayImage} /> }
//             <button onClick={() => getDog({ variables: { breed: "bulldog" }})}>Click it!</button>
//         </div>
//     );
// }



function App() {
    const [selectedDog, setSelectedDog] = useState(null);

    function onDogSelected({ target }) {
        setSelectedDog(target.value)
    }

  return (
    <div>
      <h2>Doggos via Apollo/GraphQL <span role="img" aria-label="rocket">🚀</span></h2>
      <Dogs onDogSelected={onDogSelected} />
      {selectedDog && <DogPhoto breed={selectedDog} />}
    </div>
  );
}

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
