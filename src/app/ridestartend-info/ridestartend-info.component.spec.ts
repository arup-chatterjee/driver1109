import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RidestartendInfoComponent } from './ridestartend-info.component';

describe('RidestartendInfoComponent', () => {
  let component: RidestartendInfoComponent;
  let fixture: ComponentFixture<RidestartendInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RidestartendInfoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RidestartendInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
