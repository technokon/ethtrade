import {HttpClient} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import 'rxjs/add/observable/fromPromise';
import {UploadServiceProvider} from '../upload-service/upload-service';

/*
  Generated class for the FirebaseServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseServiceProvider {

  private postingsCollection: AngularFirestoreCollection<any>;
  private categoryCollection: AngularFirestoreCollection<any>;
  postings: Observable<any>;
  categories: Observable<any>;

  constructor(public http: HttpClient,
              private angularFireStore: AngularFirestore,
              private uploadService: UploadServiceProvider,) {
    this.init();
  }

  init() {
    this.postingsCollection = this.angularFireStore.collection('postings',
      ref => ref.orderBy('title'));
    this.postings = this.postingsCollection.valueChanges();

    this.categoryCollection = this.angularFireStore.collection('categories',
      ref => ref.where('parents', '==', null));
    this.categories = this.categoryCollection.snapshotChanges();
  }

  addPosting(posting, files) {
    let collection = this.angularFireStore.collection('postings');
    let futurePostingId = collection.ref.doc().id;
    let imagePromise = this.uploadService.simpleUpload(files, futurePostingId)
      .then(snapshots => {
        posting.pictures.push(...snapshots);
        return collection.add(posting);
      });

    return Observable
      .fromPromise(imagePromise);
  }

  getPostings() {
    return this.postings;
  }

  getPostingByCategory(category) {
    return this.angularFireStore.collection('postings',
      ref => ref.where('category', '==', category.id)).valueChanges();
  }

  getTopCategories() {
    return this.categories.map(this.mapSnapshot);
  }

  getAllCategories() {
    return this.angularFireStore
      .collection('categories')
      .snapshotChanges()
      .map(this.mapSnapshot)
      .map(this.buildCategoryHierarchy)
  }

  private buildCategoryHierarchy(categories) {
    let topCategories = categories.filter(c => !c.parents);
    topCategories.forEach(tc => {
      tc.kids = [];
      tc.children.forEach(ch => {
        tc.kids.push(categories.find(c => c.id === ch));
      });
    });

    return topCategories;
  }

  private mapSnapshot(snapshot) {
    return snapshot.map(store => {
      const id = store.payload.doc.id;
      const data = store.payload.doc.data();
      return Object.assign({}, data, {id});
    });
  }

}
