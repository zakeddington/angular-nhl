import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GameService } from '../services/game.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { routerTransition } from '../router.animations';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [ routerTransition ],
})
export class GameComponent implements OnInit {
  gameId: string;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.getGameId();
  }

  getGameId() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.gameId = params.get('id');
    });
  }

  ngOnInit() {
    this.gameService.getGameDetail(this.gameId);
    this.gameService.getGameContent(this.gameId);
  }

  goBack() {
    this.location.back();
  }
}
