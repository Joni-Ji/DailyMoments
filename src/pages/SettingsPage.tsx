import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton
} from '@ionic/react';
import React from 'react';
import {auth} from '../firebase';

const SettingsPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton 
          color="medium" 
          expand="block"
          onClick={() => auth.signOut()}>
            Logout</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
