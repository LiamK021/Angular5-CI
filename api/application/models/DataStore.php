<?php
class DataStore extends CI_Model 
{
	
	function __construct()
	{
		date_default_timezone_set('America/Montreal');
    }
    // ------ USERS --------
    function insertUser($data)
    {
        $this->db->select('a.*');
        $this->db->from('users a');
        $this->db->where('a.email' , $data['email']);
        $query = $this->db->get();
        if (sizeof($query->result_array()) > 0)
        {
            return -1;
        }
        else
        {
            $this->db->insert('users', $data);
            $newid = $this->db->insert_id();
            return $newid;
        }

    }

    function getUserDataByEmail($email)
    {
        $user = array();
        $this->db->select('a.*');
        $this->db->from('users a');
        $this->db->where('a.email' , $email);
        $query = $this->db->get();
        if (sizeof($query->result_array()) > 0)
        {
            foreach ($query->result_array() as $row)
            {
                $user['id'] = $row['id'];
                $user['email'] = $row['email'];
                $user['password'] = $row['password'];
                $user['first_name'] = $row['first_name'];
                $user['last_name'] = $row['last_name'];
                $user['last_login'] = $row['last_login'];
                $user['admin'] = $row['admin'];
            }
        }
        return $user;
    }

    function getUserDataByUserID($user_id)
    {
        $user = array();
        $this->db->select('a.*');
        $this->db->from('users a');
        $this->db->where('a.id' , $user_id);
        $query = $this->db->get();
        if (sizeof($query->result_array()) > 0)
        {
            foreach ($query->result_array() as $row)
            {
                $user['id'] = $row['id'];
                $user['email'] = $row['email'];
                $user['first_name'] = $row['first_name'];
                $user['last_name'] = $row['last_name'];
                $user['last_login'] = $row['last_login'];
                $user['admin'] = $row['admin'];
            }
        }
        return $user;
    }

    function deleteUserSession($session)
    {
        $this->db->where('session_key' , $session);
        $this->db->delete('session');
    }
    function getUserDataBySessionKey($session)
    {
        $now = date("Y-m-d H:i:s");
        $limitDate = date("Y-m-d H:i:s", strtotime('-6 hours', strtotime($now)));
        $userData = array();
        $this->db->select('a.*');
        $this->db->from('session a');
        $this->db->where('a.session_key' , $session);
        $this->db->where('a.created_on > ' , $limitDate);
        $query = $this->db->get();
        if (sizeof($query->result_array()) > 0)
        {
            foreach ($query->result_array() as $row)
            {
                $this->db->select('a.*');
                $this->db->from('users a');
                $this->db->where('a.id' , $row['user_id']);

                $query2 = $this->db->get();
                if (sizeof($query2->result_array()) > 0)
                {
                    foreach ($query2->result_array() as $row2)
                    {
                        $userData['id'] = $row2['id'];
                        $userData['email'] = $row2['email'];
                        $userData['first_name'] = $row2['first_name'];
                        $userData['last_name'] = $row2['last_name'];
                        $userData['admin'] = $row2['admin'];
                        $userData['session'] = $session;
                    }
                }
            }
        }
        return $userData;
    }

    function registerUserLogin($id)
    {
        $date = date("Y-m-d H:i:s");
        $session = md5(microtime().rand());

        $loginData['last_login'] = $date;
        $this->db->where('id', $id);
        $this->db->update('users', $loginData);
        
        $this->db->where('user_id', $id);
		$this->db->delete('session');

        $sessionData = array();
        $sessionData['user_id'] = $id;
        $sessionData['session_key'] = $session;
        $sessionData['created_on'] = $date ;

        $this->db->insert('session', $sessionData);
        return $session;
    }

    function getUserList()
    {
        $users = array();
        $this->db->select('a.*');
        $this->db->from('users a');
        $query2 = $this->db->get();
        if (sizeof($query2->result_array()) > 0)
        {
            foreach ($query2->result_array() as $row2)
            {
                $userData = array();
                $userData['id'] = $row2['id'];
                $userData['email'] = $row2['email'];
                $userData['first_name'] = $row2['first_name'];
                $userData['last_name'] = $row2['last_name'];
                $userData['admin'] = $row2['admin'];

                array_push($users , $userData);
            }
        }
        return $users;
    }
    function deleteUser($id)
    {
        $this->db->where('id', $id);
        $this->db->delete('users');

        $this->db->where('user_id', $id);
        $this->db->delete('session');
    }
    // ------ /USERS --------
    // ------ DONORS --------
    function insertDonorRow($data , $order)
    {
        $donorData = array();
        $donorData['donorKey'] = $data[1];
        $donorData['donorName'] = $data[2];
        $donorData['letter'] = $data[3];
        $donorData['donor_order'] = $order;

        $this->db->insert('donors', $donorData);
        $newid = $this->db->insert_id();
    }

    function insertDonorMeta($key , $userInfo)
    {
        $now = date("Y-m-d H:i:s");
        $donorMeta = array();
        $donorMeta['author'] = $userInfo['first_name']." ".$userInfo['last_name'] ;
        $donorMeta['date'] = $now ;

        $this->db->select('a.*');
        $this->db->from('donors_category a');
        $this->db->where("a.donorKey", $key );

        $query2 = $this->db->get();
        if (sizeof($query2->result_array()) > 0)
        {
            $this->db->where('donorKey' , $key);
            $this->db->update('donors_category', $donorMeta);
        }
        else
        {
            $donorMeta['donorKey'] = $key ;
            $donorMeta['donorCategoryTitle'] = $key ;

            $this->db->insert('donors_category', $donorMeta);
            $newid = $this->db->insert_id();
        }
    }

    function insertDonor($data)
    {
        $this->db->select('a.*');
        $this->db->from('donors a');
        $this->db->order_by("a.donor_order", "asc");
        $lastOrder = -1;
        $query = $this->db->get();
        if (sizeof($query->result_array()) > 0)
        {
            foreach ($query->result_array() as $row)
            {
                // if ($row["letter"] == $data["letter"] && $lastOrder == -1)
                    $lastOrder = $row["donor_order"];
            }
        }
        
        $data["donor_order"] = $lastOrder+1;
        $this->db->insert('donors', $data);
        $newid = $this->db->insert_id();
        return $newid;
    }

    function deleteDonor($id)
    {
        $key = "";
        $this->db->select('a.*');
        $this->db->from('donors a');
        $this->db->where('id', $id);
        $query2 = $this->db->get();
        if (sizeof($query2->result_array()) > 0)
        {
            foreach ($query2->result_array() as $row2)
            {
                $key = $row2['donorKey'];
                $this->db->where('id', $id);
                $this->db->delete('donors');
            }
        }
        return $key;
    }
    function deleteDonorCategory($Key)
    {
        $this->db->where('donorKey', $Key);
        $this->db->delete('donors_category');
        
        $this->db->where('donorKey', $Key);
        $this->db->delete('donors');

        return true;
    }
    function updateDonorListTitle($data)
    {
        $this->db->where('donorKey', $data['key']);
        $this->db->set('donorCategoryTitle', $data['title']);
        $this->db->update('donors_category');
    }
    function updateDonor($data)
    {
        $this->db->where('id', $data['id']);
        $this->db->update('donors', $data);
    }
    function getDonorList()
    {
        $list = array();

        $this->db->select('a.*');
        $this->db->from('donors_category a');
        $this->db->order_by("a.donorKey", "asc");

        $query2 = $this->db->get();
        if (sizeof($query2->result_array()) > 0)
        {
            foreach ($query2->result_array() as $row2)
            {
                $donorCategory = array();
                $donorCategory['id'] = $row2['id'] ;
                $donorCategory['title'] = $row2['donorCategoryTitle'] ;
                $donorCategory['key'] = $row2['donorKey'] ;
                $donorCategory['author'] = $row2['author'] ;
                $donorCategory['date'] = $row2['date'] ;
                $donorCategory['donors'] = array();

                $this->db->select('b.*');
                $this->db->from('donors b');
                $this->db->where('b.donorKey' , $row2['donorKey']);
                $this->db->order_by("b.donorKey", "desc");
                // $this->db->order_by("b.letter", "asc");
                $this->db->order_by("b.donor_order", "asc");
                // $this->db->order_by("b.donorName", "asc");
                // echo $this->db->last_query();
                $query = $this->db->get();
                if (sizeof($query->result_array()) > 0)
                {
                    foreach ($query->result_array() as $row)
                    {
                        $params = array();
                        $params[ 'id' ] = $row['id'] ;
                        $params[ 'name' ] = $row['donorName'] ;
                        $params[ 'letter' ] = $row['letter'] ;
        
                        // if (!isset($list[ $row['donorKey'] ]))
                        //     $list[ $row['donorKey'] ] = array();
        
                        // array_push($list[ $row['donorKey'] ]  , $params );
                        array_push($donorCategory['donors'] , $params );
                    }
                }
                array_push($list , $donorCategory );
            }
        }


        return $list;
    }
    // ------ DONORS --------
    // ------ Playlist --------
    function getPlaylists()
    {
        $list = array();

        $this->db->select('a.*');
        $this->db->from('playlist a');
        $query = $this->db->get();
        if (sizeof($query->result_array()) > 0)
        {
            foreach ($query->result_array() as $row)
            {
                $playlist = array();
                $playlist['id'] = $row['id'];
                $playlist['playlist_key'] = $row['playlist_key'];
                $playlist['placement'] = $row['placement'];
                $playlist['name'] = $row['name'];
                $playlist['author'] = $row['author'];
                $playlist['date'] = $row['date'];
                $playlist['startDate'] = $row['startDate'];
                $playlist['endDate'] = $row['endDate'];
                $playlist['startTime'] = $row['startTime'];
                $playlist['endTime'] = $row['endTime'];
                $playlist['active'] = $row['active'];
                
                array_push($list  , $playlist );
            }
        }
        return $list;
    }

    function getLayoutListByPlacement( $placement )
    {
        $list = array();

        $this->db->select('a.*');
        $this->db->from('playlist_layouts_by_placement a');
        $this->db->where('a.placement' , $placement);

        $query = $this->db->get();
        if (sizeof($query->result_array()) > 0)
        {
            foreach ($query->result_array() as $row)
            {
                if (!isset($list[$row['layout']] ) )
                    $list[$row['layout']] = array();

                if (!isset($list[$row['layout']][$row['element']] ) )
                    $list[$row['layout']][$row['element']] = array();

                array_push($list[$row['layout']][$row['element']] , $row['element_attributes'] );
            }
        }
        return $list;
    }

    function getPlaylistByKey($key)
    {
        $list = array();
        $playlistID = "";
        $meta = array();
       


        $this->db->select('a.*');
        $this->db->from('playlist a');
        $this->db->where('a.playlist_key' , $key);
        // $this->db->order_by("a.play_order", "asc");
        // echo $this->db->last_query();
        $query = $this->db->get();
        if (sizeof($query->result_array()) > 0)
        {
            foreach ($query->result_array() as $row)
            {
                
                $meta['id'] = $row['id'];
                $meta['playlist_key'] = $row['playlist_key'];
                $meta['name'] = $row['name'];
                $meta['author'] = $row['author'];
                $meta['date'] = $row['date'];
                $meta['startDate'] = $row['startDate'];
                $meta['endDate'] = $row['endDate'];
                $meta['startTime'] = $row['startTime'];
                $meta['endTime'] = $row['endTime'];
                $meta['active'] = $row['active'];
                
                $list['placement'] = $row['placement'];
                $list['name'] = $row['name'];
                $list['meta'] =  $meta;
                $list['playlist'] = array();

                $playlistID = $row['id'];

                $this->db->select('b.*');
                $this->db->from('playlist_sequence b');
                $this->db->where('b.playlist_id' , $playlistID);
                $this->db->order_by("b.play_order", "asc");
                // echo $this->db->last_query();
                $query2 = $this->db->get();
                if (sizeof($query2->result_array()) > 0)
                {
                    foreach ($query2->result_array() as $row2)
                    {
                        $sequence = array();
                        $sequence['id'] = $row2['id'];
                        $sequence['play_order'] = $row2['play_order'];
                        $sequence['layout'] = $row2['layout'];
                        $sequence['layoutTitle'] = $row2['layoutTitle'];
                        $sequence['bgMovie'] = $row2['bgMovie'];
                        $sequence['solo'] = $row2['solo'];
                        $sequence['duration'] = $row2['duration'];

                        $transition = array();
                        $transition['duration'] = $row2['transition_time'];
                        $transition['Type'] = $row2['transition_type'];
                        $transition['Asset'] = $row2['transition_asset'];
                        $sequence['transition'] = $transition;

                        $sequence['layouts'] = array();

                        $this->db->select('c.*');
                        $this->db->from('playlist_layout c');
                        $this->db->where('c.sequence_id' , $row2['id']);
                        $query3 = $this->db->get();
                        if (sizeof($query3->result_array()) > 0)
                        {
                            foreach ($query3->result_array() as $row3)
                            {
                                $layout = array();
                                $layout['id'] = $row3['id'];
                                $layout['layout'] = $row3['layout'];

                                $this->db->select('d.*');
                                $this->db->from('playlist_layouts_by_placement d');
                                $this->db->where('d.element' , $row3['layout']);
                                $query4 = $this->db->get();
                                if (sizeof($query4->result_array()) > 0)
                                {
                                    foreach ($query4->result_array() as $row4)
                                    {
                                        $layout[ $row4['element_attributes'] ] = $row3[ $row4['element_attributes'] ];
                                    }
                                }
                                array_push($sequence['layouts']  , $layout );
                            }
                        }
                        array_push($list['playlist']  , $sequence );

                    }
                }
            }
        }

                /*$params = array();
                $params[ 'id' ] = $row['id'] ;
                $params[ 'play_order' ] = $row['play_order'] ;
                $params[ 'duration' ] = $row['duration'] ;
                $params[ 'transition' ] = $row['transition'] ;
                $params[ 'transtime' ] = $row['transtime'] ;
                $params[ 'screenLayout' ] = array();

                $screenLayout = array();
                $params[ 'layout' ] = $row['layout'] ;
                $params[ 'title' ] = $row['title'] ;
                $params[ 'quote' ] = $row['quote'] ;
                $params[ 'name' ] = $row['name'] ;
                $params[ 'donorKey' ] = $row['donorKey'] ;
                $params[ 'numColumns' ] = $row['numColumns'] ;
                $params[ 'imageAsset' ] = $row['imageAsset'] ;
                $params[ 'bgMovie' ] = $row['bgMovie'] ;

                array_push($ $params[ 'screenLayout' ]  , $screenLayout );

                if (!isset($list['playlist']))
                    $list['playlist'] = array();

                array_push($list['playlist']  , $params );
            }
        }*/


        return $list;
    }

    function updatePlaylist($playlist)
    {
        $this->db->where('id' , $playlist['id']);
        $this->db->set('name', $playlist['name']);
        $this->db->update('playlist');
    }

    function addPlaylistEntry($data)
    {
        $highest_playorder = -1;
        $this->db->select('a.*');
        $this->db->from('playlist_sequence a');
        $this->db->where('a.playlist_id' , $data['playlist_id']);
        $this->db->order_by("a.play_order", "asc");

        $query = $this->db->get();
        if (sizeof($query->result_array()) > 0)
        {
            foreach ($query->result_array() as $row)
            {
                if ($highest_playorder < $row['play_order'])
                {
                    $highest_playorder = $row['play_order'];
                }
            }
        }

        $newData = array();
        $newData['playlist_id'] = $data['playlist_id'];
        $newData['play_order'] = $highest_playorder+1;
        $newData['layout'] = $data['layout'];
        $newData['layoutTitle'] = $data['layoutTitle'];
        $newData['bgMovie'] = $data['bgMovie'];
        $newData['solo'] = $data['solo'];
        $newData['duration'] = $data['duration'];
        $newData['transition_type'] = $data['transition_type'];
        $newData['transition_time'] = $data['transition_time'];
        $newData['transition_asset'] = $data['transition_asset'];
        $this->db->insert('playlist_sequence', $newData);
        $newid = $this->db->insert_id();
    }
    function updatePlaylistEntry($data)
    {

        $this->db->where('id' , $data['id']);
        $this->db->set('layoutTitle' , $data['layoutTitle']);
        $this->db->set('bgMovie' , $data['bgMovie']);
        $this->db->set('solo' , $data['solo']);
        $this->db->set('duration' , $data['duration']);
        $this->db->set('transition_type' , $data['transition_type']);
        $this->db->set('transition_time' , $data['transition_time']);
        $this->db->set('transition_asset' , $data['transition_asset']);
        $this->db->update('playlist_sequence');
    }
    function deletePlaylistEntry($sequence_id)
    {
        $this->db->where('id', $sequence_id);
		$this->db->delete('playlist_sequence');
    }
    function updatePlaylistLog($playlist_id , $userInfo )
    {
        $now = date("Y-m-d H:i:s");
        $this->db->where('id' , $playlist_id);
        $this->db->set('author', $userInfo['first_name']." ".$userInfo['last_name']);
        $this->db->set('date', $now);
        $this->db->update('playlist');
    }
    function addPlaylistLayout($data)
    {
        for ($i = 0; $i<sizeof($data['layouts']); $i++)
        {
            $layoutData = array();
            $layoutData['sequence_id'] = $data['sequence_id'];
            $layoutData['layout'] = $data['layouts'][$i]['layout'];
            $layoutData['Caption'] = $data['layouts'][$i]['Caption'];
            $layoutData['Cta'] = $data['layouts'][$i]['Cta'];
            $layoutData['Title'] = $data['layouts'][$i]['Title'];
            $layoutData['Text'] = $data['layouts'][$i]['Text'];
            $layoutData['Quote'] = $data['layouts'][$i]['Quote'];
            $layoutData['Asset'] = $data['layouts'][$i]['Asset'];
            $layoutData['Donorlevel'] = $data['layouts'][$i]['Donorlevel'];

            $this->db->insert('playlist_layout', $layoutData);
            $newid = $this->db->insert_id();
        }
    }

    function editPlaylistLayout($data)
    {
        for ($i = 0; $i<sizeof($data['layouts']); $i++)
        {
            $this->db->where('id' , $data['layouts'][$i]['id']);
            $this->db->set('sequence_id' , $data['sequence_id']);
            $this->db->set('layout' , $data['layouts'][$i]['layout']);
            $this->db->set('Caption' , $data['layouts'][$i]['Caption']);
            $this->db->set('Cta' , $data['layouts'][$i]['Cta']);
            $this->db->set('Title' , $data['layouts'][$i]['Title']);
            $this->db->set('Text' , $data['layouts'][$i]['Text']);
            $this->db->set('Quote' , $data['layouts'][$i]['Quote']);
            $this->db->set('Asset' , $data['layouts'][$i]['Asset']);
            $this->db->set('Donorlevel' , $data['layouts'][$i]['Donorlevel']);
            $this->db->update('playlist_layout');
        }
    }

    function deletePlaylistLayout($sequence_id)
    {
        $this->db->where('sequence_id', $sequence_id);
		$this->db->delete('playlist_layout');
    }

    function movePlaylistSequenceUp($playlistID , $sequenceID)
    {
        $previousID = "";
        $previousOrder = "";
        $targetID = "";
        $targetOrder = "";

        $this->db->select('a.*');
        $this->db->from('playlist_sequence a');
        $this->db->where('a.playlist_id' , $playlistID);
        $this->db->order_by("a.play_order", "asc");
        // echo $this->db->last_query();
        $query = $this->db->get();
        if (sizeof($query->result_array()) > 0)
        {
            foreach ($query->result_array() as $row)
            {
                if ($row['id'] == $sequenceID)
                {
                    $targetID = $row['id'];
                    $targetOrder = $row['play_order'];
                }
                else
                {
                    if ($targetID == "")
                    {
                        $previousID = $row['id'];
                        $previousOrder = $row['play_order'];
                    }
                }
            }
        }

        if ($previousID != "" && $targetID != "")
        {
            $this->db->where('id' , $targetID);
            $this->db->set('play_order' , $previousOrder);
            $this->db->update('playlist_sequence');

            $this->db->where('id' , $previousID);
            $this->db->set('play_order' , $targetOrder);
            $this->db->update('playlist_sequence');
        }
    }

    function movePlaylistSequenceDown($playlistID , $sequenceID)
    {
        $previousID = "";
        $previousOrder = "";
        $targetID = "";
        $targetOrder = "";

        $this->db->select('a.*');
        $this->db->from('playlist_sequence a');
        $this->db->where('a.playlist_id' , $playlistID);
        $this->db->order_by("a.play_order", "asc");
        // echo $this->db->last_query();
        $query = $this->db->get();
        if (sizeof($query->result_array()) > 0)
        {
            foreach ($query->result_array() as $row)
            {
                if ($row['id'] == $sequenceID)
                {
                    $targetID = $row['id'];
                    $targetOrder = $row['play_order'];
                }
                else
                {
                    if ($targetID !== "" && $previousID == "")
                    {
                        $previousID = $row['id'];
                        $previousOrder = $row['play_order'];
                    }
                }
            }
        }

        if ($previousID != "" && $targetID != "")
        {
            $this->db->where('id' , $targetID);
            $this->db->set('play_order' , $previousOrder);
            $this->db->update('playlist_sequence');

            $this->db->where('id' , $previousID);
            $this->db->set('play_order' , $targetOrder);
            $this->db->update('playlist_sequence');
        }
    }
    function moveDonorOrderUp($donorKey , $donorID)
    {
        $previousID = "";
        $previousOrder = "";
        $targetID = "";
        $targetOrder = "";

        $this->db->select('a.*');
        $this->db->from('donors a');
        $this->db->where('a.donorKey' , $donorKey);
        $this->db->order_by("a.donor_order", "asc");
        $query = $this->db->get();
        if (sizeof($query->result_array()) > 0)
        {
            foreach ($query->result_array() as $row)
            {
                if ($row['id'] == $donorID)
                {
                    $targetID = $row['id'];
                    $targetOrder = $row['donor_order'];
                }
                else
                {
                    if ($targetID == "")
                    {
                        $previousID = $row['id'];
                        $previousOrder = $row['donor_order'];
                    }
                }
            }
        }

        if ($previousID != "" && $targetID != "")
        {
            $this->db->where('id' , $targetID);
            $this->db->set('donor_order' , $previousOrder);
            $this->db->update('donors');

            $this->db->where('id' , $previousID);
            $this->db->set('donor_order' , $targetOrder);
            $this->db->update('donors');
        }
    }

    function moveDonorOrderDown($donorKey , $donorID)
    {
        $previousID = "";
        $previousOrder = "";
        $targetID = "";
        $targetOrder = "";

        $this->db->select('a.*');
        $this->db->from('donors a');
        $this->db->where('a.donorKey' , $donorKey);
        $this->db->order_by("a.donor_order", "asc");
        // echo $this->db->last_query();
        $query = $this->db->get();
        if (sizeof($query->result_array()) > 0)
        {
            foreach ($query->result_array() as $row)
            {
                if ($row['id'] == $donorID)
                {
                    $targetID = $row['id'];
                    $targetOrder = $row['donor_order'];
                }
                else
                {
                    if ($targetID !== "" && $previousID == "")
                    {
                        $previousID = $row['id'];
                        $previousOrder = $row['donor_order'];
                    }
                }
            }
        }

        if ($previousID != "" && $targetID != "")
        {
            $this->db->where('id' , $targetID);
            $this->db->set('donor_order' , $previousOrder);
            $this->db->update('donors');

            $this->db->where('id' , $previousID);
            $this->db->set('donor_order' , $targetOrder);
            $this->db->update('donors');
        }
    }

    function getMediaFilesByUserID($user_id){

        $this->db->select('id, path, type, aspectRatio, resolution');
        $this->db->from('media');
        $this->db->where('user_id', $user_id); 
        $query = $this->db->get();
        $medias = array();
        if (sizeof($query->result_array()) > 0)
        {
            foreach ($query->result_array() as $row2)
            {
                $data = array();
                $data['id'] = $row2['id'];
                $data['path'] = $row2['path'];
                $data['type'] = $row2['type'];
                $data['aspectRatio'] = $row2['aspectRatio'];
                $data['resolution'] = $row2['resolution'];

                array_push($medias , $data);
            }
        }
        return $medias;
    }

    function pushMediaFile($user_id, $data){
        $data = array(
            'user_id' => $user_id,
            'path' => $data['file_name'],
            'type' => $data['type'],
            'aspectRatio' => $data['aspectRatio'],
            'resolution' => $data['resolution']
        );
        $this->db->insert('media', $data);
        return $this->db->insert_id();
    }
    function deleteMediaFile($id){
        $this->db->delete('media', array('id' => $id)); 
        return $this->db->affected_rows() != 0;
    }
}