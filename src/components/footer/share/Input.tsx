import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import {DialogPageProps} from './Step'
import React, {useEffect, useState } from 'react'
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles'
import {makeStyles} from '@material-ui/styles'
import { isSmartphone } from '@models/utils'

const theme = createTheme({
  palette: {
    primary: { main: '#7ececc' },
    secondary: { main: '#ef4623' },
  },
});

interface InputProps<T> extends DialogPageProps{
  inputField: JSX.Element
  value: T
  type: string
  onFinishInput: (text: T) => void
}

const useStyles = makeStyles({
  mainContainer: {
    display: 'flex',
    height: '100%',
    width:'100%',
  },
  menuContainer: {
    position:'relative',
    top:'12px',
    width:'100px',
    height:'100px'
  },
  galleryMain : {
    width:'100%',
    height:'100%',
    minWidth: '440px',
    minHeight:'245px',
    border:'2px dashed #00000030',
    left:'5px'
  },
  gallery: {
    display:'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap:10,
    overflowY:'scroll',
    overflowX: 'hidden',
    height:'300px',
    alignContent:'flex-start'
  },
  deavticeButtons: {
    position:'relative',
    padding:'10px',
    fontSize:isSmartphone() ? '1.5em' : '1em',
    fontWeight:'bold',
    borderBottom: '2px solid #7ececc',
    color:'#000000',
    cursor: 'pointer',
  },

  avticeButtons: {
    position:'relative',
    padding:'10px',
    fontSize:isSmartphone() ? '1.5em' : '1em',
    fontWeight:'bold',
    borderBottom:'2px solid #7ececc',
    color:'#ef4623',
    cursor: 'default',
  }

})

let selectedImage:string = ''
export function getSelectedImage() : string {
  return selectedImage
}

export function ResetSelectedImage() {
  selectedImage = ''
}

export function Input<T>(props: InputProps<T>) {  // tslint: disable-line
  const {
    setStep,
    value,
    onFinishInput,
    inputField,
  } = props



  /* return (
    <List>
      <ListItem>
        {inputField}
      </ListItem>
      <ListItem>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onFinishInput(value)
            setStep('none')
          }}
        >
          Done
        </Button>
      </ListItem>
    </List>
  ) */

  ///////////////////////////

  const classes = useStyles()
  const [pageIndex, setPageIndex] = useState(1) // 0

  const [active, setActive] = useState(-1)

  //console.log(props.type, " props")


  ///////////////////////////////////////////////////////////
  const [data,setData]=useState('');
  const getData=()=>{
    fetch('folderlist.php?folder=zones/*/*.png')
     .then((response) => response.text())
     .then((response) => setData(response));
    /* let dataStr = "zones/Floors/Bear Rug - Cyan.png,zones/Floors/Bear Rug - Pink.png,zones/Floors/Rectangle - Yellow.png,zones/Floors/Rug - Cyan.png,zones/Floors/Rug - Pink.png,zones/Floors/Rug - Purple.png,zones/Misc/Plant 1.png,zones/Misc/Plant 2.png,zones/Misc/Plant 3.png,zones/Seats/1 Desk Green.png,zones/Seats/2 Chairs Green.png,zones/Seats/2 Couch with Bear Rug Pink.png,zones/Seats/2 Seats Pink.png,zones/Seats/3 Couch with Bear Rug Cyan.png,zones/Seats/3 Couches Green.png,zones/Seats/4 Conference Table Green.png,zones/Seats/4 Couches Orange.png,zones/Seats/5 Couches Orange.png,zones/Seats/6 Conference Table Green.png,zones/Seats/6 Conference Table Pink.png,zones/Seats/8 Conference Table Green.png,"
    setData(dataStr) */
  }
  useEffect(()=>{
    getData()
  },[])

  //console.log(data, " data")
  // format accordingly to folder name
  const folders : Array<string> = []
  const images : Array<string> = []
  let tempArr : string = ''
  //let dataFolderWise = data.split(',')
  let tempDataFolderWise = data.split(',')

  // changing Index pos
  let floorItems:string = ''
  let miscItems:string = ''
  let seatsItems:string = ''
  for (var i:number=0; i<tempDataFolderWise.length;i++) {
    //console.log(dataFolderWise[i].indexOf("Seats"))
    if(tempDataFolderWise[i].indexOf("Floors") !== -1) {
      floorItems += tempDataFolderWise[i] + ','
    } else if(tempDataFolderWise[i].indexOf("Misc") !== -1) {
      miscItems += tempDataFolderWise[i] + ','
    } else if(tempDataFolderWise[i].indexOf("Seats") !== -1) {
      seatsItems += tempDataFolderWise[i] + ','
    }
  }
  let dataFolderWise = (seatsItems+floorItems+miscItems).split(',')

  for (let i=0; i<dataFolderWise.length-1; i++) {
    //console.log(dataFolderWise[0].split('./')[1].split('/')[1], " Fname")
    if(folders.indexOf(dataFolderWise[i].split('/')[1]) === -1) {
      folders.push(dataFolderWise[i].split('/')[1])
      //console.log(dataFolderWise[0].split('./')[1].split('/')[1])
    }
    /* for (var j=0; j < folders.length; j++) {
      if(folders[j] === dataFolderWise[i].split('./')[1].split('/')[1]) {
        //console.log(folders[j], " >>>>>>>> ", dataFolderWise[i].split('./')[1])
        tempArr.push(dataFolderWise[i].split('./')[1])
      }
      images.push(tempArr)
      console.log(tempArr, " >>>>>")
      tempArr.splice(0)
    } */
  }


  for (var j=0; j < folders.length; j++) {
    for (let i=0; i<dataFolderWise.length-1; i++) {
    if(folders[j] === dataFolderWise[i].split('/')[1]) {
      tempArr += (dataFolderWise[i]) + ','
      //tempArr.push(dataFolderWise[i].split('./')[1])
    }
  }
  // console.log(tempArr, " AAAAA")
  images.push(tempArr)
  tempArr = ''
  }



  //console.log(folders[0], " Folder ", images[0].split(','))

  ///////////////////////////////////////////////////////////
  /* const [data,setData]=useState('');
  const getData=()=>{

    fetch('zones/directory.json',
    {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        //console.log(response)
        return response.text()
      })
      .then(function(myJson) {
        let d = JSON.parse(myJson)
        let titleArr = []
        for (var i:number=0; i < d.length; i++) {
          let bool = false
          //if(titleArr.length === 0) {
            //titleArr.push(d[i].folder)
          //}
          for (var j:number=0; j < titleArr.length; j++) {
            if(titleArr[j] === d[i].folder) {
              bool = true
            }
          }
          if(bool === false) {
            //titleArr.push(d[i].folder)
            titleArr.push(d[i])
          }
        }
        setData(d)

        //////////////////////////////////////////////////////////////////////////
        //imgData.push(titleArr)
        //setArrayValue(titleArr)
        //console.log(imgData[0][0].folder)
        //console.log(titleArr[0].folder, "---", titleArr[0].url)
        //console.log(d[0].url)
        //console.log(d[0].folder);
        //let d = myJson.replace(/folder/g, '"folder"');
        //d = d.replace(/url/g, '"url"');
        //d = JSON.parse(d);
        //console.log(d[0].folder)
        //setData(d);
        //setData(myJson)
        /////////////////////////////////////////////////////////////////////
      });
  }
  useEffect(()=>{
    getData()
  },[]) */
  ///////////////////////////////////////////////////////////




  //let mValue = JSON.parse(data)
  /* if(data !== undefined) {
    console.log(Object(data[0]).folder, " Array Data")
  } */
  //console.log(Object(data).length, " Array Data")
  //console.log(imgData[0].length)



  /* if(Object(data).length > 0) {
    console.log(Object(data).length, " Array Data")
  } */



/*

  // For Table
  let _TABLES = ['zones/Floors/Bear Rug - Cyan.png', 'zones/Floors/Bear Rug - Pink.png', 'zones/Floors/Rug - Cyan.png', 'zones/Floors/Rectangle - Yellow.png', 'zones/Floors/Rug - Pink.png', 'zones/Floors/Rug - Purple.png']

  const tableItems = []
  for (let i:number = 0; i < _TABLES.length; i++) {
    tableItems.push(<div onClick = {() => {ActiveThis(i)}}><img src={encodeURIComponent(_TABLES[i])} style={{width:'130px', minHeight:'130px', height:'130px', objectFit:'contain', padding:'2px', border:active === i ? '3px solid #ef4623' : '3px solid #00000020'}} alt='' /><div style={{textAlign:'center', position:'relative', fontWeight:'bold', marginTop:'-5px'}}>{_TABLES[i].split('/')[2].split('.')[0]}</div></div>)
  }

  // For Chairs
  let _CHAIRS = ['zones/Seats/1 Desk Green.png','zones/Seats/2 Chairs Green.png', 'zones/Seats/2 Couch with Bear Rug Pink.png', 'zones/Seats/2 Seats Pink.png', 'zones/Seats/3 Couch with Bear Rug Cyan.png', 'zones/Seats/3 Couches Green.png', 'zones/Seats/4 Conference Table Green.png', 'zones/Seats/4 Couches Orange.png', 'zones/Seats/5 Couches Orange.png', 'zones/Seats/6 Conference Table Green.png', 'zones/Seats/6 Conference Table Pink.png', 'zones/Seats/8 Conference Table Green.png']
  const chairsItems = []
  for (let i:number = 0; i < _CHAIRS.length; i++) {
    chairsItems.push(<div onClick = {() => {ActiveThis(i)}}><img src={encodeURIComponent(_CHAIRS[i])} style={{width:'130px', minHeight:'130px', height:'130px', objectFit:'contain', flex:1, padding:'2px', border:active === i ? '3px solid #ef4623' : '3px dotted #00000020'}} alt='' /><div style={{textAlign:'center', position:'relative', fontWeight:'bold', marginTop:'-5px'}}>{_CHAIRS[i].split('/')[2].split('.')[0]}</div></div>)
  }

  // For Carpets
  let _CARPETS = ['zones/Misc/Plant 1.png', 'zones/Misc/Plant 2.png', 'zones/Misc/Plant 3.png']
  const carpetsItems = []
  for (let i:number = 0; i < _CARPETS.length; i++) {
    carpetsItems.push(<div onClick = {() => {ActiveThis(i)}}><img src={encodeURIComponent(_CARPETS[i])} style={{width:'130px', minHeight:'130px', height:'130px', objectFit:'contain', padding:'2px', border:active === i ? '3px solid #ef4623' : '3px dotted #00000020'}} alt='' /><div style={{textAlign:'center', position:'relative', fontWeight:'bold', marginTop:'-5px'}}>{_CARPETS[i].split('/')[2].split('.')[0]}</div></div>)
  }
 */


  /////////////////////////////////////////////////////////////////////////////

  //console.log(images, " images ")
  const _ITEMS = []
  if(images.length > 0 && pageIndex > 0) {
    let imgArr = images[pageIndex-1].split(',')
    for (let i:number = 0; i < imgArr.length-1; i++) {
      _ITEMS.push(<div onClick = {() => {ActiveThis(i)}}><img src={encodeURIComponent(imgArr[i])} style={{width:'130px', minHeight:'130px', height:'130px', objectFit:'contain', padding:'2px', border:active === i ? '3px solid #ef4623' : '3px dotted #00000020'}} alt='' /><div style={{textAlign:'center', position:'relative', fontWeight:'bold', marginTop:'-5px'}}>{imgArr[i].split('/')[2].split('.')[0]}</div></div>)
    }
  }

  // For All
  /* let _IMGS = []
  const _ITEMS = []
  //console.log(pageIndex, " pageIndex ", images[0].split(','))
  //for (let i:number = 0; i < images.length; i++) {
  let imgArr = images[pageIndex]

  console.log(imgArr, " ARR")

  for (let i:number = 0; i < imgArr.length; i++) {
    _ITEMS.push(<div onClick = {() => {ActiveThis(i)}}><img src={encodeURIComponent(imgArr[pageIndex])} style={{width:'130px', minHeight:'130px', height:'130px', objectFit:'contain', padding:'2px', border:active === i ? '3px solid #ef4623' : '3px dotted #00000020'}} alt='' /><div style={{textAlign:'center', position:'relative', fontWeight:'bold', marginTop:'-5px'}}>{imgArr[i].split('/')[2].split('.')[0]}</div></div>)
  } */

  /////////////////////////////////////////////////////////////////////////////////////

  // Holding the Images of the menu Items
  /* let _IMAGELIST = []

  for (var ii:number=0; ii < Object(data).length; ii++) {
    _IMAGELIST.push(Object(data)[ii].url)
  } */

  /* let menuListImages = []
  for (var k:number=0; k < Object(data).length; k++) {
    for (var l:number=0; l<_IMAGELIST.length; l++) {
      menuListImages.push(<ListItem style={{minWidth:'470px'}}>
      <div className={classes.galleryMain}>
      <div className={classes.gallery}><div id={"menuImg_" + l} onClick = {(evt) => {ActiveThis(Number(evt.currentTarget.id.split("_")[1]))}}><img src={encodeURIComponent(_IMAGELIST[l])} style={{width:'130px', minHeight:'130px', height:'130px', objectFit:'contain', padding:'2px', border:active === l ? '3px solid #ef4623' : '3px dotted #00000020'}} alt='' /><div style={{textAlign:'center', position:'relative', fontWeight:'bold', marginTop:'-5px'}}>{_IMAGELIST[l].split('/')[2].split('.')[0]}</div></div></div></div></ListItem>)
    }
  } */



  function EnableThis(_pageIndex:number) {
    //console.log(_pageIndex, " pageIndex")
    selectedImage = ''
    setActive(-1)
    setPageIndex(_pageIndex)
  }

  function ActiveThis(_itemIndex:number) {
    /* if(pageIndex === 1) {
      selectedImage = _TABLES[_itemIndex]
    } else if(pageIndex === 2) {
      selectedImage = _CHAIRS[_itemIndex]
    } else if(pageIndex === 3) {
      selectedImage = _CARPETS[_itemIndex]
    } */

    let imgArr = images[pageIndex-1].split(',')
    selectedImage = imgArr[_itemIndex]
    setActive(_itemIndex)
  }

  //const menuList = []
  //for (var i:number=0; i < Object(data).length; i++) {
    //console.log(Object(data[i]).id)
    /* menuList.push(<div className={pageIndex === Object(data[menuId]).id ? classes.avticeButtons : classes.deavticeButtons} onClick = {() => {EnableThis(Object(data[menuId]).id)}}>{Object(data[menuId]).folder}</div>) */
    //menuList.push(<div id={'menu_'+(i+1)} data-div_id={i+1} className={pageIndex === Object(data[i]).id ? classes.//avticeButtons : classes.deavticeButtons} onClick = {(evt) => {EnableThis(Number(evt.currentTarget.id.split("_")[1]))/* EnableThis(Object(data[i]).id) */}}>{Object(data[i]).folder}</div>)
  //}


  return (
    <div className={classes.mainContainer} /* style={{display: 'flex', height: '100%', width:'100%'}} */>
      {props.type === 'zoneimage' ?
      <div className={classes.menuContainer} /* style={{position:'relative', top:'12px', width:'100px', height:'100px'}} */>
         {/* <div className={pageIndex === 0 ? classes.avticeButtons : classes.deavticeButtons} onClick = {() => {EnableThis(0)}}>Upoad</div> */}

       {/* <div className={pageIndex === 1 ? classes.avticeButtons : classes.deavticeButtons} onClick = {() => {EnableThis(1)}}>Floor</div>
        <div className={pageIndex === 2 ? classes.avticeButtons : classes.deavticeButtons} onClick = {() => {EnableThis(2)}}>Seats</div>
        <div className={pageIndex === 3 ? classes.avticeButtons : classes.deavticeButtons} onClick = {() => {EnableThis(3)}}>Misc</div> */}

      {folders.map((items, index) => {
        return (
          <div className={pageIndex === index+1 ? classes.avticeButtons : classes.deavticeButtons} onClick = {() => {EnableThis(index+1)}}>{items}</div>
        );
      })}

        {/* <div className={pageIndex === 0 ? classes.avticeButtons : classes.deavticeButtons} onClick = {() => {EnableThis(0)}}>Upoad</div>
        {menuList} */}
        <div className={pageIndex === 0 ? classes.avticeButtons : classes.deavticeButtons} onClick = {() => {EnableThis(0)}}>Upoad</div>
      </div> : ''}

    <List>

    {pageIndex === 0 ?
      <ListItem style={props.type === 'zoneimage' ? {minWidth:'490px', height:'320px'} : {minWidth:'540px', height:'320px'} }>
        {inputField}
      </ListItem>
      : pageIndex >= 1 && props.type === 'zoneimage' ?
      <ListItem style={{minWidth:'470px'}}>
        <div className={classes.galleryMain}>
        <div className={classes.gallery}>
          {_ITEMS}
        </div>
      </div>
      </ListItem>
      /* : pageIndex === 2 && props.type === 'zoneimage' ?
      <ListItem style={{minWidth:'470px'}}>
        <div className={classes.galleryMain}>
        <div className={classes.gallery}>
          {chairsItems}
        </div>
      </div>
      </ListItem>  : pageIndex === 3 && props.type === 'zoneimage' ?
      <ListItem style={{minWidth:'470px'}}>
        <div className={classes.galleryMain}>
        <div className={classes.gallery}>
          {carpetsItems}
        </div>
      </div>
      </ListItem> */ : ''}

      <ListItem>
      <MuiThemeProvider theme={theme}>
        <Button
          variant="contained"
          color="primary"
          style={{fontSize: isSmartphone() ? '1.5em' : '1em'}}
          onClick={() => {
            //if(pageIndex === 0) {
              onFinishInput(value)
            //} else {
              //addInlineGraphics()
            //}
            setStep('none')
          }}
        >
          Done
        </Button>
        </MuiThemeProvider>
      </ListItem>
    </List>
    </div>
  )

  ///////////////////////////

}
Input.displayName = 'Input'
