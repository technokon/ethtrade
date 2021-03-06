import { Component } from '@angular/core';
import {FirebaseServiceProvider} from '../../providers/firebase-service/firebase-service';
import {MenuController} from 'ionic-angular';
import {SearchServiceProvider} from '../../providers/search-service/search-service';
import {CategoryServiceProvider} from '../../providers/category-service/category-service';

/**
 * Generated class for the MenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'h-menu',
  templateUrl: 'menu.html'
})
export class MenuComponent {

  private categories:any;
  private menuCategories:any;
  private selectedCategory;
  breadcrumbs = [];
  showBreadcrumbs = false;

  constructor(
    private service: FirebaseServiceProvider,
    private menuCtrl: MenuController,
    private searchService: SearchServiceProvider,
    private categoryService: CategoryServiceProvider,
  ) {
    this.initCategories();
    this.categorySelectReact();
  }

  private initCategories() {
    this.service.getAllCategories().
    subscribe(
      categories => {
        this.categories = categories;
        this.onCategorySelect();
      },
      error => {
        console.log(error);
      }
    );
  }

  onCategorySelect(category?) {
    this.categoryService.getCategorySelectObserver().next(category);
  }

  private categorySelectReact() {
    this.categoryService.getCategorySelect().subscribe(category => {
      this.populateMenuCategories(category);
    })
  }

  populateMenuCategories(category?) {
    if (!category) {
      this.menuCategories = this.categories;
      this.breadcrumbs = [];
      this.breadcrumbs.push({name: 'All', id: '0', root: true});
    } else {
      this.breadcrumbs = category.breadcrumbs.slice();
      this.breadcrumbs.push({
        name: category.name,
        id: category.id,
        root: true,
      });
      this.selectedCategory = category;
      if (category.kids) {
        this.menuCategories = category.kids;
      } else {
        this.fetchAds();
      }
    }
  }

  fetchAds() {
    this.menuCtrl.close();
    this.searchService.getShowSearchObserver().next(true);
    this.searchService.getCategorySearchObserver().next(this.selectedCategory);
  }

  actionBreadcrumb(breadcrumb) {
    if (breadcrumb.root) return;
    if (breadcrumb.id === '0') {
      this.populateMenuCategories();
    } else {
      let cat = this.categories.find(c => c.id === breadcrumb.id)
      this.populateMenuCategories(cat);
    }
  }

}
