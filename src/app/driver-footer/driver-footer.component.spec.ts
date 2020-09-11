import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DriverFooterComponent } from './driver-footer.component';

describe('DriverFooterComponent', () => {
  let component: DriverFooterComponent;
  let fixture: ComponentFixture<DriverFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverFooterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DriverFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
