import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FoodOrdersPage } from './food-orders.page';

describe('FoodOrdersPage', () => {
  let component: FoodOrdersPage;
  let fixture: ComponentFixture<FoodOrdersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodOrdersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FoodOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
