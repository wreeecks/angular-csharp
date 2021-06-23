import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_model/member';
import { FileUploader } from 'ng2-file-upload';
import { AccountService } from 'src/app/_services/account.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/_model/user';
import { take } from 'rxjs/operators';
import { MembersService } from 'src/app/_services/members.service';
import { Photo } from 'src/app/_model/photo';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member!: Member;
  uploader!: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user!: User;

  constructor(private accountService: AccountService, private memberService: MembersService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user );
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any){
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: `Bearer ${this.user.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response){
        var photo = JSON.parse(response);
        this.member.photos.push(photo);
        if(this.member.photos.length == 1){
          this.updateUserPhoto(photo);
        }
      }
    }
  }

  setAsMain(photo: Photo){
    this.memberService.setMainPhoto(photo).subscribe( () => {
      this.updateUserPhoto(photo);
      this.member.photos.forEach(p => {
        if(p.isMain) p.isMain = false;
        if(p.id == photo.id) p.isMain = true;
      })
    });
  }

  deletePhoto(photo: Photo){
    this.memberService.deletePhoto(photo).subscribe(() => {
      this.member.photos = this.member.photos.filter(p => p.id !== photo.id);
    });
  }

  updateUserPhoto(photo: Photo){
    this.user.photoUrl =  photo.url;
    this.member.photoUrl = photo.url;
    this.accountService.setCurrentUser(this.user); // update current user observable
  }




}
