import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from "@ngrx/effects";
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import * as fromApp from './store/app.reducer';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.modules';
import { AuthEffects } from './auth/store/auth.effects';
import { CoreModule } from './core.module';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from './header/header.component';
import { RecipeEffects } from './recipes/store/recipe.effects';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects, RecipeEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
