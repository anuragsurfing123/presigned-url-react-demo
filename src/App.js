import axios from "axios"
import { useState } from "react"
import { Container, Row, Col, Form, Button, ProgressBar } from "react-bootstrap"

function App() {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [progress, setProgress] = useState()

  const [image, setImage] = useState()
  const submitHandler = async(e) => {

    e.preventDefault()
    console.log(selectedFiles[0])
    try{

      const {name, type} = selectedFiles[0]
      const fileType = type.split('/')
  
      const response = await axios.post(`http://localhost:3000/dev/getPreSignedUrl`,{fileType: type, fileName: name})
      console.log(response);
      const {signedUrl,key} = response.data
  
      const options = {
           onUploadProgress: data => {
            //Set the progress value to show the progress bar
            setProgress(Math.round((100 * data.loaded) / data.total))
          },
        headers: {
          'Content-Type': fileType+'; charset=utf-8',
        },
      };
  
      const reee = await axios.put(signedUrl,selectedFiles[0],options)
      console.log(reee)
      const imageUrl = `https://pbt-website-images.s3.amazonaws.com/${key}`
      setImage(imageUrl)
    }catch(e){
      console.log(e)
    }

  }
  return (
    <Container>
      <Row>
        <Col lg={{ span: 4, offset: 3 }}>
          <Form>
            <Form.Group>
              <Form.Control
                type="file"
                onChange={e => {
                  setSelectedFiles(e.target.files)
                }}
              />
            </Form.Group>
            <Form.Group>
              <Button variant="info" type="submit" onClick={submitHandler}>
                Upload
              </Button>
            </Form.Group>
            {progress && <ProgressBar now={progress} label={`${progress}%`} />}
            {image && <img src={image}/>}
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default App
