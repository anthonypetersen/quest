export const modals = () => {
    return `
    <div id="active-question"></div>
    <div class="modal" id="softModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Response Requested</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div id="modalBody" class="modal-body">
                <p id="modalBodyText">There is 1 unanswered question on this page. Would you like to continue?</p>
            </div>
            <div id="softModalFooter" class="modal-footer">
                <button type="button" id=modalContinueButton class="btn btn-light" data-dismiss="modal">Continue Without Answering</button>
                <button type="button" id=modalCloseButton class="btn btn-light" data-dismiss="modal">Answer the Question</button>
            </div>
            </div>
        </div>
    </div>
    <div class="modal" id="hardModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Response Required</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p id="hardModalBodyText">There is 1 unanswered question on this page. Please answer this question.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Answer the Question</button>
            </div>
            </div>
        </div>
    </div>
    <div class="modal" id="softModalResponse" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Response Requested</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div id="modalResponseBody" class="modal-body">
                <p>There is an error with this response. Is this correct?</p>
            </div>
            <div id="softModalResponseFooter" class="modal-footer">
                <button type="button" id=modalResponseContinueButton class="btn btn-success" data-dismiss="modal">Correct</button>
                <button type="button" id=modalResponseCloseButton class="btn btn-danger" data-dismiss="modal">Incorrect</button>
            </div>
            </div>
        </div>
    </div>
    
      <div class="modal" id="submitModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
          <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title">Submit Answers</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="modal-body">
              <p id="submitModalBodyText">Are you sure you want to submit your answers?</p>
          </div>
          <div class="modal-footer">
            <button type="button" id="submitModalButton" class="btn btn-success" data-dismiss="modal">Submit</button>
            <button type="button" id="cancelModal" class="btn btn-danger" data-dismiss="modal">Cancel</button>
          </div>
          </div>
      </div>
    </div>
    `
}