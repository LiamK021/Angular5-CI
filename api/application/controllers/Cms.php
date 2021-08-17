<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Cms extends \Restserver\Libraries\REST_Controller {

	public function __construct($config = 'rest')
    {
        parent::__construct($config);

        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization, Session-Info");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        $method = $_SERVER['REQUEST_METHOD'];
        if ($method == "OPTIONS") {
            die();
        }
	}
	
	public function index()
	{
		$this->load->helper(array('form', 'url'));
	}
	/* 
	public function registerUser_post(){
		$postData = $this->post();
		$password = $postData['password'];
		$encryptOptions = array();
		$encryptOptions['cost'] = 12;
		$password = password_hash($password, PASSWORD_BCRYPT, $encryptOptions);

		$userData=array();
		$userData['email'] = $postData['email'];
		$userData['password'] = $password; 
		$userData['first_name'] = $postData['first_name'];
		$userData['last_name'] = $postData['last_name'];
		$userData['admin'] = $postData['admin'];
		$userData['last_login'] = "0000-00-00 00:00:00";
		
		$id=$this->DataStore->insertUser($userData);
		if ($id == -1)
		{
			$response = array();
			$response['error'] = "This email alreay exists in our system";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_EXPECTATION_FAILED);

		}
		else
		{
			$this->response($id, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		
	} */
	// ------- Users ---------
	public function register_post()
	{
		$session = $this->input->get_request_header('Session-Info');
		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']) && isset($userInfo['admin']) && $userInfo['admin'] == 1 )
		{
			$postData = $this->post();
			$password = $postData['password'];
			$encryptOptions = array();
			$encryptOptions['cost'] = 12;
			$password = password_hash($password, PASSWORD_BCRYPT, $encryptOptions);

			$userData=array();
			$userData['email'] = $postData['email'];
			$userData['password'] = $password; 
			$userData['first_name'] = $postData['first_name'];
			$userData['last_name'] = $postData['last_name'];
			$userData['admin'] = $postData['admin'];
			$userData['last_login'] = "0000-00-00 00:00:00";
			
			$id=$this->DataStore->insertUser($userData);
			if ($id == -1)
			{
				$response = array();
				$response['error'] = "This email alreay exists in our system";
				$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_EXPECTATION_FAILED);

			}
			else
			{
				$this->response($id, \Restserver\Libraries\REST_Controller::HTTP_OK);
			}
			
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}
	public function login_post()
	{
		$postData = $this->post();
		$email = $postData['email'];
		$password = $postData['password'];

		$userData = $this->DataStore->getUserDataByEmail($email);
		if (isset($userData['password']) && password_verify($password , $userData['password'])) {
			$session = $this->DataStore->registerUserLogin($userData['id']);
			$validUserData = array();
			$validUserData['id'] = $userData['id'];
			$validUserData['email'] = $userData['email'];
			$validUserData['first_name'] = $userData['first_name'];
			$validUserData['last_name'] = $userData['last_name'];
			$validUserData['admin'] = $userData['admin'];
			$validUserData['session'] = $session;
			$this->response($validUserData, \Restserver\Libraries\REST_Controller::HTTP_OK);
		} else {
			$response = array();
			$response['error'] = "We could not log you in. Please check your user name and/or password";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}

	public function logout_post()
	{
		$result = array();
		$session = $this->input->get_request_header('Session-Info');
		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$this->DataStore-> deleteUserSession($session);
			$result['result'] = "success";
		}
		
		$this->response( $result , \Restserver\Libraries\REST_Controller::HTTP_OK);

	}

	public function handshake_post()
	{
		$session = $this->input->get_request_header('Session-Info');

		$postData = $this->post();

		$userData = $this->DataStore->getUserDataBySessionKey($session);

		$this->response($userData, \Restserver\Libraries\REST_Controller::HTTP_OK);
	}
	public function users_get()
	{
		$session = $this->input->get_request_header('Session-Info');
		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']) && isset($userInfo['admin']) && $userInfo['admin'] == 1 )
		{
			$userList = $this->DataStore->getUserList();

			$this->response($userList, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}
	public function user_delete($id)
	{
		$session = $this->input->get_request_header('Session-Info');
		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']) && isset($userInfo['admin']) && $userInfo['admin'] == 1 )
		{
			$this->DataStore->deleteUser($id);
			$userList = $this->DataStore->getUserList();

			$this->response($userList, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}
	// ------- /Users ---------
	// ------- DONORS ---------
	public function donors_get()
	{
		$getData = $this->get();
		$donors = $this->DataStore->getDonorList();
		
		$this->response($donors, \Restserver\Libraries\REST_Controller::HTTP_OK);
	}

	public function donor_post()
	{
		$session = $this->input->get_request_header('Session-Info');
		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$postData = $this->post();
			$this->DataStore->insertDonor($postData);

			$this->DataStore->insertDonorMeta($postData['donorKey'] , $userInfo );
			$donors = $this->DataStore->getDonorList();
			$this->response($donors, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}
	public function donor_put()
	{
		$session = $this->input->get_request_header('Session-Info');
		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$getData = $this->put();
			$this->DataStore->updateDonor($getData);

			$this->DataStore->insertDonorMeta($getData['donorKey'] , $userInfo );
			$donors = $this->DataStore->getDonorList();
			$this->response($donors, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}
	public function donor_delete($id)
	{
		$session = $this->input->get_request_header('Session-Info');
		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$donorKey = $this->DataStore->deleteDonor($id);

			$this->DataStore->insertDonorMeta($donorKey , $userInfo );
			$donors = $this->DataStore->getDonorList();
			$this->response($donors, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}
	public function donorCategory_delete($key)
	{
		$session = $this->input->get_request_header('Session-Info');
		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$this->DataStore->deleteDonorCategory($key);

			$donors = $this->DataStore->getDonorList();
			$this->response($donors, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}
	public function updateDonorListTitle_post()
	{
		$session = $this->input->get_request_header('Session-Info');
		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$postData = $this->post();
			$this->DataStore->updateDonorListTitle($postData);

			$this->DataStore->insertDonorMeta($postData['key'] , $userInfo );
			$donors = $this->DataStore->getDonorList();
			$this->response($donors, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}
	public function moveDonorOrderUp_post()
	{
		$session = $this->input->get_request_header('Session-Info');
	
		$postData = $this->post();
		$donor_id = $postData ['donor_id'];
		$donor_key = $postData ['donor_key'];


		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$this->DataStore->moveDonorOrderUp($donor_key , $donor_id);
			$donors = $this->DataStore->getDonorList();

			$this->response($donors, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}

	public function moveDonorOrderDown_post()
	{
		$session = $this->input->get_request_header('Session-Info');
	
		$postData = $this->post();
		$donor_id = $postData ['donor_id'];
		$donor_key = $postData ['donor_key'];


		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$this->DataStore->moveDonorOrderDown($donor_key , $donor_id);
			$donors = $this->DataStore->getDonorList();

			$this->response($donors, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}
	// ------- DONORS ---------
	// ------- Playlist ---------
	public function playlists_get()
	{

		$playlists = $this->DataStore->getPlaylists();
		
		$this->response($playlists, \Restserver\Libraries\REST_Controller::HTTP_OK);
	}
	public function playlist_get()
	{
		$key = $this->get('key');
		$playlist = $this->DataStore->getPlaylistByKey($key);
		
		$this->response($playlist, \Restserver\Libraries\REST_Controller::HTTP_OK);
	}
	public function layouts_get()
	{
		$session = $this->input->get_request_header('Session-Info');
		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$placement = $this->get('placement');
			$layouts = $this->DataStore->getLayoutListByPlacement($placement);
			
			$this->response($layouts, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}
	public function playlist_put()
	{
		$playlist = $this->put('playlist');
		$this->DataStore->updatePlaylist($playlist );
		
		
	}
	public function addPlaylistEntry_post()
	{
		$session = $this->input->get_request_header('Session-Info');

		$postData = $this->post();
		$playlist_id = $postData ['playlist_id'];
		$playlist_key = $postData ['playlist_key'];
		// $transition = $postData ['transition'];
		// $transition_time = $postData ['transition_time'];
		// $duration = $postData ['duration'];

		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$this->DataStore->addPlaylistEntry($postData );
			$this->DataStore->updatePlaylistLog($playlist_id , $userInfo );
			$playlist = $this->DataStore->getPlaylistByKey($playlist_key);
			$this->response($playlist, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}

	public function updatePlaylistEntry_post()
	{
		$session = $this->input->get_request_header('Session-Info');

		$postData = $this->post();
		$playlist_id = $postData ['playlist_id'];
		$playlist_key = $postData ['playlist_key'];
		// $transition = $postData ['transition'];
		// $transition_time = $postData ['transition_time'];
		// $duration = $postData ['duration'];

		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$this->DataStore->updatePlaylistEntry($postData );
			$this->DataStore->updatePlaylistLog($playlist_id , $userInfo );
			$playlist = $this->DataStore->getPlaylistByKey($playlist_key);
			$this->response($playlist, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}

	public function deletePlaylistEntry_post()
	{
		$session = $this->input->get_request_header('Session-Info');
	
		$postData = $this->post();
		$sequence_id = $postData ['sequence_id'];
		$playlist_id = $postData ['playlist_id'];
		$playlist_key = $postData ['playlist_key'];


		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$this->DataStore->deletePlaylistEntry($sequence_id );
			$this->DataStore->updatePlaylistLog($playlist_id , $userInfo);
			$playlist = $this->DataStore->getPlaylistByKey($playlist_key);

			$this->response($playlist, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}
	public function playlistLayout_post()
	{
		$session = $this->input->get_request_header('Session-Info');
	
		$postData = $this->post();
		$sequence_id = $postData ['sequence_id'];
		$playlist_id = $postData ['playlist_id'];
		$playlist_key = $postData ['playlist_key'];


		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			if ($postData['layouts'][0]['id'] == '')
			{
				$this->DataStore->addPlaylistLayout($postData );
			}
			else
			{
				$this->DataStore->editPlaylistLayout($postData );
			}
			$this->DataStore->updatePlaylistLog($playlist_id , $userInfo);
			$playlist = $this->DataStore->getPlaylistByKey($playlist_key);

			$this->response($playlist, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}

	}


	public function deletePlaylistLayout_post()
	{
		$session = $this->input->get_request_header('Session-Info');
	
		$postData = $this->post();
		$layout_id = $postData ['layout_id'];
		$playlist_id = $postData ['playlist_id'];
		$playlist_key = $postData ['playlist_key'];


		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$this->DataStore->deletePlaylistLayout($layout_id );
			$this->DataStore->updatePlaylistLog($playlist_id , $userInfo);
			$playlist = $this->DataStore->getPlaylistByKey($playlist_key);

			$this->response($playlist, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}

	public function movePlaylistSequenceUp_post()
	{
		$session = $this->input->get_request_header('Session-Info');
	
		$postData = $this->post();
		$sequence_id = $postData ['sequence_id'];
		$playlist_id = $postData ['playlist_id'];
		$playlist_key = $postData ['playlist_key'];


		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$this->DataStore->movePlaylistSequenceUp($playlist_id , $sequence_id);
			$playlist = $this->DataStore->getPlaylistByKey($playlist_key);

			$this->response($playlist, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}

	public function movePlaylistSequenceDown_post()
	{
		$session = $this->input->get_request_header('Session-Info');
	
		$postData = $this->post();
		$sequence_id = $postData ['sequence_id'];
		$playlist_id = $postData ['playlist_id'];
		$playlist_key = $postData ['playlist_key'];


		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$this->DataStore->movePlaylistSequenceDown($playlist_id , $sequence_id);
			$playlist = $this->DataStore->getPlaylistByKey($playlist_key);

			$this->response($playlist, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}


	public function uploadImage_post()
	{
		$session = $this->input->get_request_header('Session-Info');
		$result = array();
		$result['imageFile'] = "";
		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$config['upload_path'] = './images/';
			$config['allowed_types'] = '*';
			$config['remove_spaces']= true;
			// $config['encrypt_name']= true;
			$config['overwrite']= false;
		
			$this->load->library('upload', $config);
		
			$uploads= $_FILES;
			foreach($uploads as $file => $value)
			{
				if(isset($value['name']))
				{
					$this->upload->initialize($config);
					if ($file == 'files')
					{
						if ($this->upload->do_upload('files'))
						{
							$uploadData = $this->upload->data();
							if ($uploadData['file_size'] > 0 && strtolower($uploadData['file_ext']) != '.gif' && strtolower($uploadData['file_ext']) != '.jpg' && strtolower($uploadData['file_ext']) != '.jpeg' && strtolower($uploadData['file_ext']) != '.png' && strtolower($uploadData['file_ext']) != '.jpe')
							{
								$myMessage =  "This file type is not allowed";
								$hasError = true;
							}
							else
							{
								$photoData = array('upload_data' => $uploadData);
								$result['imageFile'] = $photoData['upload_data']['file_name'];
							}
						}
					}
				}
			}
			$this->response($result, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}

	public function uploadDonorCSV_post()
	{
		$session = $this->input->get_request_header('Session-Info');
		$result = array();
		$userInfo = $this->DataStore->getUserDataBySessionKey($session );
		if (isset($userInfo) && isset($userInfo['id']))
		{
			$config['upload_path'] = './csv/';
			$config['allowed_types'] = '*';
			$config['remove_spaces']= true;
			$config['overwrite']= true;
		
			$this->load->library('upload', $config);
		
			$uploads= $_FILES;
			foreach($uploads as $file => $value)
			{
				if(isset($value['name']))
				{
					$this->upload->initialize($config);
					if ($file == 'csvFile')
					{
						if ($this->upload->do_upload('csvFile'))
						{
							$uploadData = $this->upload->data();
							if ($uploadData['file_size'] > 0 && strtolower($uploadData['file_ext']) != '.csv')
							{
								$myMessage =  "This file type is not allowed";
								$hasError = true;
							}
							else
							{
								$handle = fopen($_FILES['csvFile']['tmp_name'], "r");
								if ($handle) {
									$order = 0;
									$donorKey = "";
									while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) 
									{
										if ($order > 0)
										{
											if ($donorKey == "") $donorKey = $data[1];
											$this->DataStore->insertDonorRow($data , $order );
										}
										$order ++;
									}
									$this->DataStore->insertDonorMeta($donorKey , $userInfo );
								} else {
									die("Unable to open file");
								}


							}
						}
					}
				}
			}
			$donors = $this->DataStore->getDonorList();
			$this->response($donors, \Restserver\Libraries\REST_Controller::HTTP_OK);
		}
		else
		{
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}
	// ------- Playlist ---------
	public function mediaFiles_post(){

		$session = $this->input->get_request_header('Session-Info');
		$userInfo = $this->DataStore->getUserDataBySessionKey($session);

		if(isset($userInfo) && isset($userInfo['id'])){

			$media_folder = './media/';

			$config['upload_path'] = $media_folder;
			$config['allowed_types'] = '*';
			$config['max_size'] = 20000;
			
			$this->load->library('upload', $config);

			if(! $this->upload->do_upload('file') ){
				$response = array();
				$response['error'] = "Something went wrong";
				$this->response($this->upload->display_errors(), \Restserver\Libraries\REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
			} else {
				$data = $this->upload->data();

				$postData = $this->post();

				$persistenceData = array(
					'file_name' => $data['file_name'],
					'type' => $data['file_type'],
					'aspectRatio' => $postData['aspectRatio'],
					'resolution' => $postData['resolution']
				);

				$id = $this->DataStore->pushMediaFile($userInfo['id'], $persistenceData);

				$response = array(
					array(
						'id' => $id,
						'path' => $data['file_name'],
						'type' => $data['file_type'],
						'aspectRatio' => $postData['aspectRatio'],
						'resolution' => $postData['resolution']
					)
				);
				$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_OK);	
			}

		} else {
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}

	}
	public function mediaFiles_get(){
		$session = $this->input->get_request_header('Session-Info');
		$userInfo = $this->DataStore->getUserDataBySessionKey($session);
		if(isset($userInfo) && isset($userInfo['id'])){
			$medias = $this->DataStore->getMediaFilesByUserID($userInfo['id']);
			$this->response($medias, \Restserver\Libraries\REST_Controller::HTTP_OK);
		} else {
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}
	public function deleteMediaFile_post(){
		$session = $this->input->get_request_header('Session-Info');
		$userInfo = $this->DataStore->getUserDataBySessionKey($session);
		if(isset($userInfo) && isset($userInfo['id'])){
			$postData = $this->post();
			$success = $this->DataStore->deleteMediaFile($postData['id']);
			$response = array(
				"success" => $success
			);
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_OK);
		} else {
			$response = array();
			$response['error'] = "Your session is invalid. please log in again";
			$this->response($response, \Restserver\Libraries\REST_Controller::HTTP_UNAUTHORIZED);
		}
	}
	
}
