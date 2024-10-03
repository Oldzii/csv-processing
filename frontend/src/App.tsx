import './App.css';
import CSVManagement from './views/CSVManagement';

function App() {
  const handleFileClick = (fileId: number) => {
    alert(`File with ID ${fileId} clicked`);
  };

  return (
    <div className="App">
      <CSVManagement />
    </div>
  );
}

export default App;
