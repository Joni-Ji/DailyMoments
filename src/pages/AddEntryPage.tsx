import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonInput,
  IonButton,
  IonList,
  IonItem,
  IonTextarea,
  IonDatetime,
  IonLabel
} from '@ionic/react';
import { CameraResultType, Plugins } from '@capacitor/core';
import React, { useEffect, useRef, useState } from 'react';
// import { useHistory } from 'react-router';
import { useAuth } from '../auth';
import { firestore, store } from '../firebase';
const { Camera } = Plugins;

const AddEntryPage: React.FC = () => {
  const [date, setDate] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { userId } = useAuth();
  const [pictureUrl, setPictureUrl] = useState('/assets/placeholder.png');
  const fileInputRef = useRef<HTMLInputElement>();
  // const history = useHistory();

  async function savePicture(blobUrl, userId){
    const pictureRef = store.ref(`/users/${userId}/pictures/${Date.now()}`);
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const snapshot = await pictureRef.put(blobUrl);
    const url = await snapshot.ref.getDownloadURL();
    console.log("Saved:",url);
    return url;

  }
  useEffect(() => () => {
    if(pictureUrl.startsWith('blob')) {
      URL.revokeObjectURL(pictureUrl);
      console.log('Revoked',pictureUrl);
    }
  }, [pictureUrl]);

  const handleFileChange = (event: React.ChangeEvent <HTMLInputElement>) => {
    console.log('Files:',event.target.files);
    if(event.target.files.length >0){
       const file = event.target.files.item(0);
       const pictureUrl = URL.createObjectURL(file);
      //  console.log('created:', pictureUrl);
       setPictureUrl(pictureUrl);
    }
  };
  const handlePictureClick = async () => {
    try{
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        width: 600,
      });
      // console.log('myPhoto:',photo.webPath);
      setPictureUrl(photo.webPath);

    }catch (error){
      console.log('Camera error:', error);
    }
  };

  const handleSave = async () => {
    const entriesRef = firestore.collection("users").doc(userId).collection("entries");
    const entryData = { date, title, pictureUrl, description };
    if(pictureUrl.startsWith('blob')){
       entryData.pictureUrl = await savePicture(pictureUrl, userId);
    }
    const entryRef = await entriesRef.add(entryData);
    console.log('saved', entryRef.id);
    // history.goBack();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle> Adding Entries </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating">Date </IonLabel>
            <IonDatetime value={date} onIonChange={(e) => setDate(e.detail.value)} />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Title </IonLabel>
            <IonInput type="text" value={title} onIonChange={(e) => setTitle(e.detail.value)} />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Picture </IonLabel><br/><br/>
            <input type="file" accept="image/*" hidden ref={fileInputRef} 
              onChange={handleFileChange} />
            <img src={pictureUrl} alt="" style={{cursor:'pointer'}}
              onClick={handlePictureClick} />

{/* onClick={() => fileInputRef.current.click()} /> */}   
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Description </IonLabel>
            <IonTextarea value={description} onIonChange={(e) => setDescription(e.detail.value)} />
          </IonItem>

        </IonList>

        <IonButton expand="block" type="submit" onClick={handleSave} routerLink="/my/entries"> Submit </IonButton>

      </IonContent>
    </IonPage >
  );
};

export default AddEntryPage;
