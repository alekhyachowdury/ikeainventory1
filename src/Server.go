package main

import (
    "fmt"  
    "log"
    "net/http"
    "database/sql"        
    "io/ioutil"
    "encoding/json"
      _ "github.com/lib/pq"
)

var db *sql.DB
var intno string
var err error

type event struct {
    Intname    string    
   
}

type response struct {
    Intname    string 
    Solutionname  string
    Technology string
    Source string
    Target string 
    GitLink string
    Server     string  
    CompositeList []string 
    QueueList     []string 
   
}


func QueryDataFromDB(w http.ResponseWriter, r *http.Request) {
    
        var newEvent event

        var INT string

        fmt.Println("Request Received in GO")
   
        reqBody, err := ioutil.ReadAll(r.Body)
        if err != nil {
                fmt.Println("Kindly enter valid data ")
                 }
        fmt.Println(reqBody)
        fmt.Println(json.Unmarshal(reqBody ,  &newEvent))
        fmt.Println(newEvent.Intname)
        
        INT = newEvent.Intname

 
        datastoreName := "user=postgres password=ikea@1291 dbname=postgres sslmode=disable"     

       
        db, err = sql.Open("postgres", datastoreName)
        checkErr(err)       
        
    


        source , solutionname , target , technology , compositeList , error := fetchData(INT)        

        checkErr(error)

        queueList , error := fetch12cq(INT)

        checkErr(error)

        GitLink , error := fetchGit(INT)

        checkErr(error)


        var newResponse response

            newResponse.Intname = INT
            newResponse.Server = "SOA-RT"
            newResponse.Solutionname = solutionname
            newResponse.Technology = technology
            newResponse.Source = source
            newResponse.Target = target
            newResponse.GitLink = GitLink
            newResponse.CompositeList = compositeList    
            newResponse.QueueList = queueList
    
   
    
        ResponseJson, err := json.Marshal(newResponse)
        if(err != nil )  {
            panic(err)

            }   


        w.Header().Set("Content-Type","application/json")
        w.WriteHeader(http.StatusOK)
        w.Write(ResponseJson)   

    }

func checkErr(err error) {
    if err != nil {
        log.Fatal(err)
                
                }
    }


func fetchData(num string) (string , string , string , string , []string ,error) {

        var source string
        var intno string
        var soln string
        var comp string
        var compList []string
        var target string
        var tech string

        stmt :=  fmt.Sprintf("SELECT intno,solutionname,source,complist,target,technology FROM sof_inventory where intno = '%s", num +"'")
        fmt.Println(stmt)
        result , err :=  db.Query(stmt)
        
        checkErr(err)
        defer result.Close()
    

        for result.Next() {       
            
            err :=  result.Scan(&intno ,&soln ,&source ,&comp ,&target ,&tech)
            checkErr(err)

             log.Println(intno  , soln ,source ,comp ,target ,tech) 
             compList = append(compList , comp)
         
        }
       
        return source ,soln , target , tech , compList , err
}

func fetch12cq(num string) ( []string , error) {

        var queueList []string
        var queue string

        stmt := fmt.Sprintf("SELECT qname FROM queuestopics12c where intno = '%s", num +"'")      

        resultQ , err :=  db.Query(stmt)      

        for resultQ.Next() {

            err :=  resultQ.Scan(&queue)
            checkErr(err)            
            queueList = append(queueList , queue)

        }

        return queueList ,  err

}

func fetchGit(num string) (string , error){

        var gitLink string

        stmt :=  fmt.Sprintf("SELECT gitlink FROM gitdetails where intno = '%s", num +"'")

        resultG , err :=  db.Query(stmt)

        for resultG.Next() {

                err :=  resultG.Scan(&gitLink)
                checkErr(err) 

        }

        return gitLink , err

}






func main() {


    http.HandleFunc("/invoke", QueryDataFromDB)
    err := http.ListenAndServe(":9090", nil) // setting listening port
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}