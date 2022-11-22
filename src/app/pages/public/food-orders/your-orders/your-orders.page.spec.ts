import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { YourOrdersPage } from './your-orders.page';

describe('YourOrdersPage', () => {
  let component: YourOrdersPage;
  let fixture: ComponentFixture<YourOrdersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourOrdersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(YourOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
