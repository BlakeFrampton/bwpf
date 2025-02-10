// Using plain React (without JSX) for simplicity
const { useState, useEffect } = React;

function Shufflefy() {
  const [data, setData] = useState([]);

  // For demo purposes, simulate fetching some data
  useEffect(() => {
    // You could replace this with an API call or any logic
    setData(['Item 1', 'Item 2', 'Item 3']);
  }, []);

  return React.createElement(
    'div',
    { style: { fontFamily: 'sans-serif', padding: '20px' } },
    [
      React.createElement('h1', { key: 'h1' }, 'Shufflefy App'),
      React.createElement(
        'ul',
        { key: 'list' },
        data.map((item, index) =>
          React.createElement('li', { key: index }, item)
        )
      ),
    ]
  );
}

// Render the app inside the div with id "root"
ReactDOM.render(
  React.createElement(Shufflefy),
  document.getElementById('root')
);
