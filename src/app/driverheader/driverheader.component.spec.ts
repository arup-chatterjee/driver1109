import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DriverheaderComponent } from './driverheader.component';

describe('DriverheaderComponent', () => {
  let component: DriverheaderComponent;
  let fixture: ComponentFixture<DriverheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverheaderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DriverheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
