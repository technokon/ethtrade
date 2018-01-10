import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrationComponent } from './registration/registration';
import { PostingComponent } from './posting/posting';
import { GuideCardComponent } from './guide-card/guide-card';
import { PostingFormComponent } from './posting-form/posting-form';
import { ConfirmationCardComponent } from './confirmation-card/confirmation-card';
import { MapCardComponent } from './map-card/map-card';

@NgModule({
	declarations: [
    RegistrationComponent,
    PostingComponent,
    GuideCardComponent,
    PostingFormComponent,
    ConfirmationCardComponent,
    MapCardComponent,
  ],
	imports: [
    IonicPageModule.forChild(RegistrationComponent),
  ],
	exports: [
    RegistrationComponent,
    PostingComponent,
    GuideCardComponent,
    PostingFormComponent,
    ConfirmationCardComponent,
    MapCardComponent,
  ]
})
export class ComponentsModule {}
