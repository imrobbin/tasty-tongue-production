import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TastyTonguePage } from './tasty-tongue.page';

describe('TastyTonguePage', () => {
    let component: TastyTonguePage;
    let fixture: ComponentFixture<TastyTonguePage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TastyTonguePage],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(TastyTonguePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
