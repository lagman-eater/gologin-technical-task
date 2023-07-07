import './App.css';
import { useEffect, useState } from 'react';
import fileImg from './1024px-File_alt_font_awesome.svg.png'

function App() {
  const [parseBtn, setParseBtn] = useState(true)
  const [profileFile, setProfileFile] = useState()
  const [textAreaValue, setTextAreaValue] = useState('')
  const [fileName, setFileName] = useState()
  const [drag, setDrag] = useState(false)
  const [profileArr, setProfileArr] = useState([])
  const [parseBtnClicked, setParseBtnClicked] = useState(false)

  function handleFileChange(e) {
    const file = e.target.files[0]
    console.log(e.target.files[0]);
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      setProfileFile(reader.result)
      setFileName(file.name)
      setTextAreaValue('')
    }
    reader.onerror = () => {
      console.log('file error', reader.error);
    }
  }

  function handleBufferClick() {
    navigator.clipboard
      .readText()
      .then((text) => setTextAreaValue(text))
  }

  function dragHandler(e) {
    e.preventDefault()
    setDrag(true)
  }

  function dragLeaveHandler(e) {
    e.preventDefault()
    setDrag(false)
  }

  function dropHandler(e) {
    e.preventDefault()
    let file = e.dataTransfer.files[0]
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      setProfileFile(reader.result)
      setFileName(file.name)
      setDrag(false)
      setTextAreaValue('')
    }
    reader.onerror = () => {
      console.log('file error', reader.error);
    }
  }

  function parseClickHandler() {
    setParseBtnClicked(true)
    let arrProf = []
    let arrRes = []
    let keysIn = []
    let valsIn = [0]
    let keys = []
    let vals = []
    arrProf.push(profileArr)
    arrProf = arrProf[0].split('')
    arrProf = arrProf.filter((e) => 
      e !== '\r' && e !== '\n'
    )
    for(let i = 0;i < arrProf.length; i++){
      if(arrProf[i] === ':'){
        keysIn.push(i)
      } else if(arrProf[i] === ','){
        valsIn.push(i)
      }
      // if(arrProf[i] !== ':'){
      //   let key = []
      //   key.push(arrProf[i])
      // } else if (arrProf[i] !== ','){
      //   let val = []
      // }
    }
    for(let i = 0;i < keysIn.length; i++){
      let key 
      let val
      key = arrProf.slice(valsIn[i] + 1, keysIn[i]).join('')    
      val = arrProf.slice(keysIn[i] + 1, valsIn[i + 1]).join('')
      keys.push(key)
      vals.push(val)
      if(key === 'Cookies'){
        return
      }
      console.log(keys);
      console.log(vals);
      let result = {};
      keys.forEach((key, idx) => result[key] = vals[idx]);
      console.log(result);
    }
  }

  function handleBackButton() {
    setParseBtnClicked(false)
    setProfileFile(null)
  }

  useEffect(() => {
    if (!(profileFile == null) || textAreaValue.length > 0) {
      setParseBtn(false)
    } else {
      setParseBtn(true)
    }
    textAreaValue.length > 0 ? setProfileArr(textAreaValue) : setProfileArr(profileFile)
  }, [profileFile, textAreaValue])

  return (
    <div className='App'>
      <header>
        <h1>Diushembiev Aidar parser<br />technical task for Gologin</h1>
        {
          parseBtnClicked
            ?
            <button className='backBtn' onClick={handleBackButton}>Назад</button>
            :
            <button className='parseBtn' disabled={parseBtn} onClick={parseClickHandler}>Парсить</button>
        }
      </header>
      {
        parseBtnClicked
          ?
          <div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Facebook login</th>
                  <th>Facebook password</th>
                  <th>Facebook token</th>
                  <th>Email login</th>
                  <th>Email password</th>
                  <th>Useragent</th>
                  <th>Cookies</th>
                </tr>
              </thead>
              <tbody>
                {/* {profileArr.map((e, i) =>
                  <tr>
                    <td>{i + 1}</td>
                    <td>{e.fb}</td>
                    <td>{e.fbPass}</td>
                    <td>{e.token}</td>
                    <td>{e.email}</td>
                    <td>{e.emailPass}</td>
                    <td>{e.UserAgent}</td>
                    <td>{e.Cookies}</td>
                  </tr>
                )} */}
              </tbody>
            </table>
          </div>
          :
          profileFile ?
            <main
              className={drag ? 'dragActive' : null}
              onDragStart={e => dragHandler(e)}
              onDragLeave={e => dragLeaveHandler(e)}
              onDragOver={e => dragHandler(e)}
              onDrop={e => dropHandler(e)}
            >
              <img src={fileImg} alt='File' />
              <h2>{fileName}</h2>
              <div className='buttons'>
                <label>
                  Выбрать другой файл
                  <input type="file" id="file" name="file" onChange={handleFileChange} />
                </label>
                <button onClick={() => setProfileFile(null)}>Назад</button>
              </div>
              {/* <div>{profileFile}</div> */}
            </main>
            :
            <>
              <main
                style={{ display: textAreaValue.length > 3 ? 'none' : 'flex' }}
                className={drag ? 'dragActive' : null}
                onDragStart={e => dragHandler(e)}
                onDragLeave={e => dragLeaveHandler(e)}
                onDragOver={e => dragHandler(e)}
                onDrop={e => dropHandler(e)}>
                <img src={fileImg} alt='File' />
                <h2>Перетащите файл с профилями</h2>
                <div>Или нажмите "Выбрать файл"</div>
                <div className='buttons'>
                  <label>
                    Выбрать файл
                    <input type="file" id="file" name="file" onChange={handleFileChange} />
                  </label>
                  <button onClick={handleBufferClick}>Вставить из буфера</button>
                </div>
              </main>
              <div className='textArea'>
                <textarea
                  value={textAreaValue}
                  style={{ minHeight: textAreaValue.length > 3 ? '637px' : '200px' }}
                  type='text'
                  placeholder='Введите или вставьте данные из шопов'
                  onChange={(e) => setTextAreaValue(e.target.value)}
                ></textarea>
              </div>
            </>
      }
    </div >
  );
}

export default App;
