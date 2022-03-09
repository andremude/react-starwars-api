import {useState, useEffect, useRef } from "react"
import './App.css';
import data from "./data.json";
import { getCharacter, getPeople, searchCharacter } from "./api/people";

function App() {
  const [people, setPeople] = useState([]);
  const [currentCharacter, setCurrentCharacter] = useState(1);
  const [details, setDetails] = useState({});
  const inputSearch = useRef(null);
  const [textSearch, setTextSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getPeople(page)
    .then(setPeople);
  }, [page]);

  useEffect(() => {
    getCharacter(currentCharacter).then(setDetails)
  }, [currentCharacter]);


  const showDetails = (character) => {
    const id = Number(character.url.split("/").slice(-2)[0])
    setCurrentCharacter(id);
  };

  const onChangeTextSearch = (event) => {
    event.preventDefault();
    const text = inputSearch.current.value;
    setTextSearch(text);
  }

  const onSearchSubmit = (event) => {
    if(event.key !== "Enter") return;

    inputSearch.current.value = "";
    setDetails({});
    searchCharacter(textSearch)
    .then(setPeople)
  }

  const onChangePage = (next) => {
    if(!people.previous && page + next <= 0) return;
    if (!people.next && page + next >= 9) return;

    setPage(page + next);
  }


  return (
    <div>
      <div className="search-container">
        <input
          ref={inputSearch}
          onChange={onChangeTextSearch}
          onKeyDown={onSearchSubmit}
          type="text"
          placeholder="Search for a character"
          className="search-bar" />
      </div>

      <div className="body-container">

      <div className="left-container">
        <h4>Select a character to display information.</h4>
        <ul className="characters-list">
          {people?.results?.map((character) => (
            <li key={character.name} onClick={() => showDetails(character)}> {character.name} </li>
          ))}
        </ul>

        <section className="pages-controllers">
          <button onClick={() => onChangePage(-1)}>Prev</button>
          |  {page}  |
          <button onClick={() => onChangePage(+1)}>Next</button>
        </section>
      </div>



        <aside className="character-container">
          <h1>{details.name}</h1>
          <ul>
            <li>Height: {details.height} cm</li>
            <li>Mass: {details.mass} kg</li>
            <li>Gender: {details.gender}</li>
            <li>Year of birth: {details.birth_year}</li>
            <li>Hair color: {details.hair_color}</li>
            <li>Skin color: {details.skin_color}</li>
            <li>Eye color: {details.eye_color}</li>
          </ul>
        </aside>
      </div>

    </div>
  );
}

export default App;
