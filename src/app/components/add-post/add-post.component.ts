import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { SubtidderService } from '../../services/subtidder.service';
import { AuthService } from '../../services/auth.service';
import { Subtidder } from '../../models/subtidder';
declare var $: any;

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  @Input() subtidder: string;

  postData: Post;
  subtidders: Array<Subtidder> = [];

  constructor(
    private postService: PostService,
    private subtidderService: SubtidderService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.makeNewPost();
    this.getAllSubtidders();
  }

  submitPost() {
    this.postData.author_id = +this.authService.getId();
    this.postService.submitPost(this.postData).subscribe(
      res => {
        this.postService.notifyPostAdditionOrDeletion();
        this.makeNewPost();
      },
      err => console.log(err)
    )
  }

  getAllSubtidders() {
    this.subtidderService.getAllSubtidders().subscribe(
      res => {
        this.subtidders = res.subtidders;
        $('#select-subtidder').dropdown();
      },
      err => console.log(err)
    )
  }

  makeNewPost() {
    this.postData = new Post();
    if (this.subtidder) this.postData.subtidder = this.subtidder;
  }

}
